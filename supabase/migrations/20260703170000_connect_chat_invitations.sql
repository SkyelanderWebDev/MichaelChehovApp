-- Michael Chekhov Toolkit — Connect chat room admin + email invitations (Build 0.2.1 lane).
--
-- HOSTED APPLY STATUS: NOT applied to the hosted Supabase project. Hosted apply
-- is a Dawson-approved lane. Note: the 0.2.0 chat migration
-- (20260702190000_connect_group_chat.sql) is ALSO not applied hosted yet; this
-- migration depends on it and must be applied after it.
--
-- Product contract (2026-07-03 follow-up sprint):
-- - Add a `leadership` room kind: a private beta coordination/leadership group
--   room (Dawson + Lisa first). It is a group room, NOT a direct message.
-- - Owner-only email invitations: the room owner invites a specific email
--   address; the invitee accepts a single-use, expiring, email-locked link.
-- - The raw invite token is returned ONCE to the owner from the create RPC and
--   is never stored or readable anywhere: only a SHA-256 hash is persisted, and
--   the token_hash column carries no client select grant.
-- - Email DELIVERY is not part of this migration. The app surfaces the invite
--   link for the owner to send; wiring a real email provider is a separate
--   server-side lane (never service-role-in-browser).
-- - Accept requires: signed-in user, pending + unexpired invite, caller email
--   matching the invited (normalized) email, and an open (non-archived) room.
-- - Non-owners cannot create, list, or revoke invitations; members cannot
--   harvest invitee emails (owner-only select policy).
--
-- Mirrors the definer-function/grants/guarded-policy idiom from
-- 20260702190000_connect_group_chat.sql.

-- 1. LEADERSHIP ROOM KIND.
--    The 0.2.0 inline check constraint is auto-named chat_rooms_kind_check.
alter table public.chat_rooms drop constraint if exists chat_rooms_kind_check;
alter table public.chat_rooms add constraint chat_rooms_kind_check
  check (kind in ('class', 'show', 'community', 'leadership'));

-- 2. INVITATIONS.
--    token_hash is the only credential material stored; the raw token exists
--    only in the create RPC's return value.
create table if not exists public.chat_room_invitations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  invited_email text not null,
  invited_email_normalized text not null
    check (
      char_length(invited_email_normalized) between 3 and 320
      and position('@' in invited_email_normalized) > 1
      and invited_email_normalized !~ '\s'
    ),
  invited_by uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked', 'expired')),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists chat_room_invitations_room_created_idx
  on public.chat_room_invitations (room_id, created_at desc);

-- One live invite per room + email; creating again supersedes (revokes) the
-- previous pending invite inside the create RPC.
create unique index if not exists chat_room_invitations_room_email_pending_key
  on public.chat_room_invitations (room_id, invited_email_normalized)
  where status = 'pending';

-- 3. CREATE INVITATION (SECURITY DEFINER RPC) — owner only.
--    Returns the invitation id, the RAW token (sole exposure, shown once to the
--    owner), and the expiry. Everything else about the token is hash-only.
create or replace function public.create_chat_room_invitation(target_room uuid, invitee_email text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized text;
  raw_token text;
  invitation_id uuid;
  invite_expires timestamptz;
  pending_count integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in to invite testers' using errcode = 'insufficient_privilege';
  end if;

  if not exists (
    select 1 from public.chat_rooms r
    where r.id = target_room
      and r.created_by = auth.uid()
      and r.archived_at is null
  ) then
    raise exception 'Only the owner of an open room can invite by email'
      using errcode = 'insufficient_privilege';
  end if;

  normalized := lower(trim(coalesce(invitee_email, '')));
  if char_length(normalized) < 3
    or char_length(normalized) > 320
    or position('@' in normalized) <= 1
    or normalized ~ '\s'
  then
    raise exception 'Enter a valid email address' using errcode = 'check_violation';
  end if;

  -- Past-expiry pending rows are effectively expired and don't count.
  select count(*) into pending_count
  from public.chat_room_invitations i
  where i.room_id = target_room
    and i.status = 'pending'
    and i.expires_at > now();

  if pending_count >= 50 then
    raise exception 'This room already has the maximum number of pending invites'
      using errcode = 'check_violation';
  end if;

  -- Supersede any previous pending invite for the same room + email so the
  -- newest link is the only live one.
  update public.chat_room_invitations
  set status = 'revoked'
  where room_id = target_room
    and invited_email_normalized = normalized
    and status = 'pending';

  raw_token := encode(extensions.gen_random_bytes(24), 'hex');
  invite_expires := now() + interval '7 days';

  insert into public.chat_room_invitations
    (room_id, invited_email, invited_email_normalized, invited_by, token_hash, expires_at)
  values
    (
      target_room,
      trim(invitee_email),
      normalized,
      auth.uid(),
      encode(extensions.digest(raw_token, 'sha256'), 'hex'),
      invite_expires
    )
  returning id into invitation_id;

  return json_build_object(
    'invitation_id', invitation_id,
    'token', raw_token,
    'expires_at', invite_expires
  );
end;
$$;

revoke execute on function public.create_chat_room_invitation(uuid, text) from public;
revoke execute on function public.create_chat_room_invitation(uuid, text) from anon;
grant execute on function public.create_chat_room_invitation(uuid, text) to authenticated;

-- 4. ACCEPT INVITATION (SECURITY DEFINER RPC) — single-use, email-locked.
create or replace function public.accept_chat_room_invitation(token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  invite record;
  caller_email text;
begin
  if auth.uid() is null then
    raise exception 'Sign in to accept an invite' using errcode = 'insufficient_privilege';
  end if;

  if trim(coalesce(token, '')) = '' then
    raise exception 'No invite matches this link' using errcode = 'no_data_found';
  end if;

  select * into invite
  from public.chat_room_invitations i
  where i.token_hash = encode(extensions.digest(trim(token), 'sha256'), 'hex')
  for update;

  if invite is null then
    raise exception 'No invite matches this link' using errcode = 'no_data_found';
  end if;

  -- Expiry is enforced here and derived at read time. (An update-then-raise
  -- status flip would roll back with the exception, so the row keeps status
  -- 'pending'; clients and the create RPC treat past-expiry pending rows as
  -- expired.)
  if invite.status = 'pending' and invite.expires_at <= now() then
    raise exception 'This invite has expired' using errcode = 'no_data_found';
  end if;

  if invite.status = 'revoked' then
    raise exception 'This invite was revoked' using errcode = 'no_data_found';
  end if;

  if invite.status <> 'pending' then
    raise exception 'This invite has already been used' using errcode = 'no_data_found';
  end if;

  select lower(trim(coalesce(u.email, ''))) into caller_email
  from auth.users u
  where u.id = auth.uid();

  if caller_email is distinct from invite.invited_email_normalized then
    raise exception 'This invite was sent to a different email address'
      using errcode = 'insufficient_privilege';
  end if;

  if not exists (
    select 1 from public.chat_rooms r
    where r.id = invite.room_id
      and r.archived_at is null
  ) then
    raise exception 'This room is closed' using errcode = 'no_data_found';
  end if;

  insert into public.chat_room_members (room_id, user_id, role)
  values (invite.room_id, auth.uid(), 'member')
  on conflict (room_id, user_id) do nothing;

  update public.chat_room_invitations
  set status = 'accepted',
      accepted_at = now(),
      accepted_user_id = auth.uid()
  where id = invite.id;

  return invite.room_id;
end;
$$;

revoke execute on function public.accept_chat_room_invitation(text) from public;
revoke execute on function public.accept_chat_room_invitation(text) from anon;
grant execute on function public.accept_chat_room_invitation(text) to authenticated;

-- 5. REVOKE INVITATION (SECURITY DEFINER RPC) — owner only, pending only.
create or replace function public.revoke_chat_room_invitation(invitation uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  revoked_count integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in to manage invites' using errcode = 'insufficient_privilege';
  end if;

  update public.chat_room_invitations i
  set status = 'revoked'
  from public.chat_rooms r
  where i.id = invitation
    and i.status = 'pending'
    and r.id = i.room_id
    and r.created_by = auth.uid();

  get diagnostics revoked_count = row_count;
  if revoked_count = 0 then
    raise exception 'Only the room owner can revoke a pending invite'
      using errcode = 'insufficient_privilege';
  end if;
end;
$$;

revoke execute on function public.revoke_chat_room_invitation(uuid) from public;
revoke execute on function public.revoke_chat_room_invitation(uuid) from anon;
grant execute on function public.revoke_chat_room_invitation(uuid) to authenticated;

-- 6. GRANTS — hash-free, column-scoped reads; all writes go through the
--    definer RPCs above (no insert/update/delete grants for clients).
revoke all on public.chat_room_invitations from anon;
revoke all on public.chat_room_invitations from authenticated;

-- token_hash, invited_email_normalized, invited_by, and accepted_user_id are
-- deliberately NOT selectable by clients.
grant select (id, room_id, invited_email, status, expires_at, created_at, accepted_at)
  on public.chat_room_invitations to authenticated;

grant all on public.chat_room_invitations to service_role;

-- 7. RLS — owner-only visibility so members/outsiders cannot harvest emails.
alter table public.chat_room_invitations enable row level security;

drop policy if exists chat_room_invitations_select_owner on public.chat_room_invitations;

create policy chat_room_invitations_select_owner
  on public.chat_room_invitations for select to authenticated
  using (
    exists (
      select 1 from public.chat_rooms r
      where r.id = room_id
        and r.created_by = auth.uid()
    )
  );
