-- Michael Chekhov Toolkit secure-beta core schema.
-- Supabase Auth owns identity; every tester-owned table is protected by RLS.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  beta_role text not null default 'tester',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create table if not exists public.daily_practices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_date date not null,
  source text not null check (source in ('self-selected', 'random', 'global-daily')),
  status text not null check (status in ('preview', 'started')),
  category_id text not null,
  category_name text not null,
  parent_tool_name text not null,
  child_tool_name text,
  scale_value integer,
  unveiled_value integer,
  selected_tool jsonb not null,
  started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_practices_one_per_user_day unique (user_id, local_date),
  constraint daily_practices_id_user_unique unique (id, user_id)
);

create index if not exists daily_practices_user_date_idx
  on public.daily_practices (user_id, local_date desc);

create trigger set_daily_practices_updated_at
before update on public.daily_practices
for each row execute function public.set_updated_at();

create table if not exists public.poa_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  daily_practice_id uuid not null,
  mode text not null default 'journal' check (mode in ('structured', 'journal')),
  practice_notes text not null default '',
  observe_morning text not null default '',
  observe_midday text not null default '',
  observe_evening text not null default '',
  apply_morning text not null default '',
  apply_midday text not null default '',
  apply_evening text not null default '',
  journal_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint poa_daily_practice_owner_fk
    foreign key (daily_practice_id, user_id)
    references public.daily_practices (id, user_id)
    on delete cascade,
  constraint poa_entries_one_per_practice unique (user_id, daily_practice_id)
);

create index if not exists poa_entries_user_practice_idx
  on public.poa_entries (user_id, daily_practice_id);

create trigger set_poa_entries_updated_at
before update on public.poa_entries
for each row execute function public.set_updated_at();

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(trim(message)) between 1 and 4000),
  context jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feedback_user_created_idx
  on public.feedback (user_id, created_at desc);

create trigger set_feedback_updated_at
before update on public.feedback
for each row execute function public.set_updated_at();

create table if not exists public.library_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  creator text,
  citation text not null,
  rights_note text not null,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.library_sources(id) on delete set null,
  title text not null,
  summary text not null,
  excerpt text,
  source_status text not null default 'private-beta source review' check (
    source_status in ('approved', 'public-domain-review', 'private-beta source review')
  ),
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.daily_practices enable row level security;
alter table public.poa_entries enable row level security;
alter table public.feedback enable row level security;
alter table public.library_sources enable row level security;
alter table public.library_items enable row level security;

create policy profiles_select_own
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy profiles_insert_own
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy profiles_update_own
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy daily_practices_select_own
  on public.daily_practices for select to authenticated
  using (auth.uid() = user_id);

create policy daily_practices_insert_own
  on public.daily_practices for insert to authenticated
  with check (auth.uid() = user_id);

create policy daily_practices_update_own
  on public.daily_practices for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy daily_practices_delete_own
  on public.daily_practices for delete to authenticated
  using (auth.uid() = user_id);

create policy poa_entries_select_own
  on public.poa_entries for select to authenticated
  using (auth.uid() = user_id);

create policy poa_entries_insert_own
  on public.poa_entries for insert to authenticated
  with check (auth.uid() = user_id);

create policy poa_entries_update_own
  on public.poa_entries for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy poa_entries_delete_own
  on public.poa_entries for delete to authenticated
  using (auth.uid() = user_id);

create policy feedback_select_own
  on public.feedback for select to authenticated
  using (auth.uid() = user_id);

create policy feedback_insert_own
  on public.feedback for insert to authenticated
  with check (auth.uid() = user_id);

create policy feedback_update_own
  on public.feedback for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy library_sources_read_for_testers
  on public.library_sources for select to authenticated
  using (true);

create policy library_items_read_for_testers
  on public.library_items for select to authenticated
  using (true);

insert into public.library_sources (id, title, creator, citation, rights_note, url)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'Chart of Inspired Action',
    'National Michael Chekhov Association / Lisa Dalton',
    'Chart of Inspired Action © 2004 National Michael Chekhov Association. Used with permission. Lisa Dalton, NMCA President and Master Teacher.',
    'Approved beta attribution; keep wording centralized for Lisa/NMCA refinement.',
    null
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Michael Chekhov source study placeholder',
    'Michael Chekhov',
    'Source/citation under review for closed private beta; replace with permissioned/public-domain citation before public release.',
    'Private beta source review in progress; no generated embodied practice prompt text.',
    null
  )
on conflict (id) do nothing;

insert into public.library_items (id, source_id, title, summary, excerpt, source_status, sort_order)
values
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000101',
    'Chart attribution and beta context',
    'A tester-facing source card preserving the NMCA/Lisa/Chart attribution for the private beta.',
    null,
    'approved',
    10
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000102',
    'Source excerpt slot',
    'Reserved for a sourced, cited Chekhov or Lisa excerpt after Dawson/Lisa/source review. This card intentionally contains no generated embodied teaching prompt.',
    null,
    'private-beta source review',
    20
  )
on conflict (id) do nothing;
