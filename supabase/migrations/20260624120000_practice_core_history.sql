-- Michael Chekhov Toolkit — practice-core history, lock, and post-lock notes.
-- Append-only logging plus an explicit "completed" lock state for Daily Practice.
--
-- HOSTED APPLY IS GATED: do NOT apply this migration to the hosted Supabase
-- project. Hosted apply is reserved for Dawson/Rudy. This file is authored only.
--
-- Mirrors the per-user RLS pattern from 20260610192000_secure_beta_core.sql:
-- every tester-owned table is auth.uid() = user_id, authenticated role only.

-- 1. F1 POA LOCK — add an explicit "completed" lock state to daily_practices.
--    The day locks on an explicit "Complete Practice" tap (not midnight), after
--    which the core POA fields are immutable. We keep the existing upsert /
--    unique(user_id, local_date) untouched and only widen the status check and
--    add lock metadata columns.
alter table public.daily_practices
  drop constraint if exists daily_practices_status_check;

alter table public.daily_practices
  add constraint daily_practices_status_check
  check (status in ('preview', 'started', 'completed'));

alter table public.daily_practices
  add column if not exists completed_at timestamptz;

-- G3 FLYBACK — a lightweight per-day reflection note, distinct from the full POA.
alter table public.daily_practices
  add column if not exists flyback_note text;

-- 2. F1 DRAW HISTORY — append-only log of EVERY Journal draw / re-roll / pick.
--    This does NOT relax the daily_practices unique constraint; daily_practices
--    still upserts one row per day, while every roll is logged here.
create table if not exists public.draw_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_date date not null,
  source text not null check (source in ('self-selected', 'random', 'global-daily')),
  selected_tool jsonb not null,
  drawn_at timestamptz not null default now()
);

create index if not exists draw_history_user_date_idx
  on public.draw_history (user_id, local_date desc, drawn_at desc);

-- 3. F1 POST-LOCK NOTES — append-only notes added AFTER the POA is locked.
--    Tied to the owning daily_practice via the (id, user_id) composite, matching
--    poa_entries so RLS and ownership stay consistent.
create table if not exists public.poa_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  daily_practice_id uuid not null,
  note text not null check (char_length(trim(note)) between 1 and 4000),
  created_at timestamptz not null default now(),
  constraint poa_notes_daily_practice_owner_fk
    foreign key (daily_practice_id, user_id)
    references public.daily_practices (id, user_id)
    on delete cascade
);

create index if not exists poa_notes_user_practice_idx
  on public.poa_notes (user_id, daily_practice_id, created_at desc);

-- 4. RLS — per-user, authenticated only. Both tables are insert + select for the
--    owner. They are append-only by design, so no update/delete policies are
--    granted (cascade delete on auth.users still cleans up).
alter table public.draw_history enable row level security;
alter table public.poa_notes enable row level security;

create policy draw_history_select_own
  on public.draw_history for select to authenticated
  using (auth.uid() = user_id);

create policy draw_history_insert_own
  on public.draw_history for insert to authenticated
  with check (auth.uid() = user_id);

create policy poa_notes_select_own
  on public.poa_notes for select to authenticated
  using (auth.uid() = user_id);

create policy poa_notes_insert_own
  on public.poa_notes for insert to authenticated
  with check (auth.uid() = user_id);
