-- Michael Chekhov Toolkit — Connect group-room chat MVP (Build 0.2.0 lane).
--
-- HOSTED APPLY STATUS: NOT applied to the hosted Supabase project. Hosted apply
-- is a Dawson-approved lane; keep this migration additive-only until then.
--
-- Product contract (2026-07-02 sprint):
-- - Group rooms only (class/show/community). No DMs, no public room directory.
-- - Room creation restricted to explicitly authorized creators (initially
--   Dawson and Lisa), enforced server-side via an allowlist table — not UI hiding.
-- - Members join with an invite code; members see only rooms they belong to.
-- - Messages are text-only and append-only for this MVP (no edit/delete,
--   no attachments — attachments wait for a verified Storage/RLS lane).
-- - Push notifications and realtime subscriptions are deferred; clients poll.
--
-- Mirrors the RLS idiom from 20260610192000_secure_beta_core.sql and the
-- grants/guarded-policy idiom from 20260624120000_practice_core_history.sql.

-- 1. AUTHORIZED CREATORS ALLOWLIST.
--    No insert/update/delete policies and no write grants: rows are seeded only
--    by a Dawson-approved operator action (SQL editor / service role), e.g.
--      insert into public.chat_room_creators (user_id)
--      values ('<dawson-uuid>'), ('<lisa-uuid>');
--    A signed-in user may read only their own row, so the app can decide
--    whether to show the "create room" affordance.
create table if not exists public.chat_room_creators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. ROOMS.
-- created_by is RESTRICT, not cascade: deleting a creator's auth account must
-- not silently destroy a class room and every member's shared messages. The
-- operator lane archives/deletes rooms first when retiring a creator account.
create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete restrict,
  name text not null check (char_length(trim(name)) between 1 and 80),
  kind text not null default 'class' check (kind in ('class', 'show', 'community')),
  invite_code text not null unique,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_chat_rooms_updated_at
before update on public.chat_rooms
for each row execute function public.set_updated_at();

-- 3. MEMBERSHIP.
create table if not exists public.chat_room_members (
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create index if not exists chat_room_members_user_idx
  on public.chat_room_members (user_id);

-- 4. MESSAGES — append-only, text-only.
--    sender_name is a server-stamped display snapshot (see trigger below) so
--    members never need read access to other testers' profile rows.
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_name text not null default '',
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_room_created_idx
  on public.chat_messages (room_id, created_at desc);

-- 5. MEMBERSHIP HELPER (SECURITY DEFINER).
--    chat_room_members policies cannot reference chat_room_members without
--    infinite RLS recursion, so membership checks go through a definer helper.
create or replace function public.is_chat_room_member(target_room uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.chat_room_members m
    where m.room_id = target_room
      and m.user_id = auth.uid()
  );
$$;

revoke execute on function public.is_chat_room_member(uuid) from public;
revoke execute on function public.is_chat_room_member(uuid) from anon;
grant execute on function public.is_chat_room_member(uuid) to authenticated;

-- 6. ROOM DEFAULTS TRIGGER — server-generated invite code.
--    Forces the code server-side so clients cannot pick guessable vanity codes.
create or replace function public.handle_new_chat_room_defaults()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.invite_code := encode(extensions.gen_random_bytes(5), 'hex');
  else
    -- Owners may rename/archive but never replace the server-generated code
    -- with a guessable vanity value.
    new.invite_code := old.invite_code;
  end if;
  return new;
end;
$$;

drop trigger if exists chat_rooms_defaults on public.chat_rooms;
create trigger chat_rooms_defaults
  before insert or update on public.chat_rooms
  for each row execute function public.handle_new_chat_room_defaults();

revoke execute on function public.handle_new_chat_room_defaults() from public;
revoke execute on function public.handle_new_chat_room_defaults() from anon;
revoke execute on function public.handle_new_chat_room_defaults() from authenticated;

-- 7. OWNER MEMBERSHIP TRIGGER — creator becomes owner/member of their room.
create or replace function public.handle_new_chat_room_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.chat_room_members (room_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (room_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists chat_rooms_owner_membership on public.chat_rooms;
create trigger chat_rooms_owner_membership
  after insert on public.chat_rooms
  for each row execute function public.handle_new_chat_room_owner();

revoke execute on function public.handle_new_chat_room_owner() from public;
revoke execute on function public.handle_new_chat_room_owner() from anon;
revoke execute on function public.handle_new_chat_room_owner() from authenticated;

-- 8. JOIN BY INVITE CODE (SECURITY DEFINER RPC).
--    Non-members cannot select rooms, so the join path is a definer function
--    that looks up the code and inserts the caller's own membership.
create or replace function public.join_chat_room(code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_room uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to join a room' using errcode = 'insufficient_privilege';
  end if;

  select r.id into target_room
  from public.chat_rooms r
  where lower(r.invite_code) = lower(trim(code))
    and r.archived_at is null;

  if target_room is null then
    raise exception 'No open room matches that invite code' using errcode = 'no_data_found';
  end if;

  insert into public.chat_room_members (room_id, user_id, role)
  values (target_room, auth.uid(), 'member')
  on conflict (room_id, user_id) do nothing;

  return target_room;
end;
$$;

revoke execute on function public.join_chat_room(text) from public;
revoke execute on function public.join_chat_room(text) from anon;
grant execute on function public.join_chat_room(text) to authenticated;

-- 9. SENDER NAME STAMP TRIGGER.
--    Overwrites any client-supplied sender_name from the sender's own profile.
--    Legacy email-local-part display names are treated as account plumbing (the
--    0.1.1 PDF lesson) and blanked; the app renders a neutral fallback.
create or replace function public.stamp_chat_message_sender()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Server-stamped creation time: clients cannot forge message history order.
  new.created_at := now();
  new.sender_name := coalesce(
    (
      select trim(p.display_name)
      from public.profiles p
      where p.id = new.sender_id
        and p.display_name is not null
        and trim(p.display_name) <> ''
        -- Email-shaped names are account plumbing, never chat display names:
        -- block the email local-part, the full email, and anything with an @.
        and lower(trim(p.display_name)) <> split_part(lower(coalesce(p.email, '')), '@', 1)
        and lower(trim(p.display_name)) <> lower(coalesce(p.email, ''))
        and position('@' in p.display_name) = 0
    ),
    ''
  );
  return new;
end;
$$;

drop trigger if exists chat_messages_sender_stamp on public.chat_messages;
create trigger chat_messages_sender_stamp
  before insert on public.chat_messages
  for each row execute function public.stamp_chat_message_sender();

revoke execute on function public.stamp_chat_message_sender() from public;
revoke execute on function public.stamp_chat_message_sender() from anon;
revoke execute on function public.stamp_chat_message_sender() from authenticated;

-- 10. GRANTS — Supabase/PostgREST needs table privileges in addition to RLS.
--     Least privilege: membership writes happen only inside definer functions,
--     messages are append-only, the allowlist is read-only for clients.
revoke all on public.chat_room_creators from anon;
revoke all on public.chat_rooms from anon;
revoke all on public.chat_room_members from anon;
revoke all on public.chat_messages from anon;

-- Revoke-first so environment default privileges cannot widen the surface;
-- the grants below are the complete authenticated privilege set.
revoke all on public.chat_room_creators from authenticated;
revoke all on public.chat_rooms from authenticated;
revoke all on public.chat_room_members from authenticated;
revoke all on public.chat_messages from authenticated;

grant select on public.chat_room_creators to authenticated;
grant select, insert on public.chat_rooms to authenticated;
grant update (name, kind, archived_at) on public.chat_rooms to authenticated;
grant select, delete on public.chat_room_members to authenticated;
grant select, insert on public.chat_messages to authenticated;

-- Operator lane: allowlist seeding, moderation, and smoke cleanup run with the
-- service role (never shipped to clients).
grant all on public.chat_room_creators to service_role;
grant all on public.chat_rooms to service_role;
grant all on public.chat_room_members to service_role;
grant all on public.chat_messages to service_role;

-- 11. RLS.
alter table public.chat_room_creators enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_room_members enable row level security;
alter table public.chat_messages enable row level security;

-- Guarded for partial-apply recovery and SQL-editor reruns.
drop policy if exists chat_room_creators_select_own on public.chat_room_creators;
drop policy if exists chat_rooms_select_member on public.chat_rooms;
drop policy if exists chat_rooms_insert_authorized_creator on public.chat_rooms;
drop policy if exists chat_rooms_update_owner on public.chat_rooms;
drop policy if exists chat_room_members_select_member on public.chat_room_members;
drop policy if exists chat_room_members_delete_self on public.chat_room_members;
drop policy if exists chat_messages_select_member on public.chat_messages;
drop policy if exists chat_messages_insert_member_self on public.chat_messages;

create policy chat_room_creators_select_own
  on public.chat_room_creators for select to authenticated
  using (auth.uid() = user_id);

create policy chat_rooms_select_member
  on public.chat_rooms for select to authenticated
  using (created_by = auth.uid() or public.is_chat_room_member(id));

-- Server-enforced creator allowlist: the exists() subquery runs under the
-- caller's RLS, and chat_room_creators only exposes the caller's own row.
create policy chat_rooms_insert_authorized_creator
  on public.chat_rooms for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.chat_room_creators c
      where c.user_id = auth.uid()
    )
  );

create policy chat_rooms_update_owner
  on public.chat_rooms for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy chat_room_members_select_member
  on public.chat_room_members for select to authenticated
  using (public.is_chat_room_member(room_id));

-- Members can leave; owners cannot orphan their own room in this MVP.
create policy chat_room_members_delete_self
  on public.chat_room_members for delete to authenticated
  using (auth.uid() = user_id and role <> 'owner');

create policy chat_messages_select_member
  on public.chat_messages for select to authenticated
  using (public.is_chat_room_member(room_id));

-- Anti-spoof: a member may insert only as themselves, only into their rooms,
-- and only while the room is open (archived rooms are read-only).
create policy chat_messages_insert_member_self
  on public.chat_messages for insert to authenticated
  with check (
    auth.uid() = sender_id
    and public.is_chat_room_member(room_id)
    and exists (
      select 1 from public.chat_rooms r
      where r.id = room_id
        and r.archived_at is null
    )
  );
