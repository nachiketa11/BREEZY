-- ═══════════════════════════════════════════════════════════════════════════════
-- BREEZY — Database Schema (Supabase Postgres)
-- Run this in the Supabase SQL Editor after creating your project.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── 1. Profiles ─────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  branch text not null,
  semester int not null
);

alter table profiles enable row level security;

create policy "Own profile only" on profiles
  for all using (auth.uid() = id);


-- ── 2. Tasks ────────────────────────────────────────────────────────────────
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  due_date date not null,
  completed boolean not null default false
);

alter table tasks enable row level security;

create policy "Own tasks only" on tasks
  for all using (auth.uid() = user_id);


-- ── 3. Attendance ───────────────────────────────────────────────────────────
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  attended int not null default 0,
  total int not null default 0
);

alter table attendance enable row level security;

create policy "Own attendance only" on attendance
  for all using (auth.uid() = user_id);


-- ── 4. Events ───────────────────────────────────────────────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_date date not null,
  event_time time not null
);

alter table events enable row level security;

create policy "Own events only" on events
  for all using (auth.uid() = user_id);
