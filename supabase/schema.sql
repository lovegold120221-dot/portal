-- =============================================================================
-- Eburon AI — Complete Supabase Schema
-- Paste this into the Supabase SQL editor and run.
-- Covers: apps, users, services, tasks, issues, chats, models,
--         app_assignments, app_comments, and chat_messages.
-- =============================================================================

-- =============================================================================
-- 1. USERS (must come first — referenced by assignments, comments, tasks, issues)
-- =============================================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text,
  first_name text not null default '',
  last_name text not null default '',
  username text not null unique,
  phone_number text not null default '',
  role text not null default 'user' check (role in ('admin', 'developer', 'client', 'user')),
  status text not null default 'active' check (status in ('active', 'inactive', 'invited', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  clerk_user_id text unique
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_users_status on public.users(status);
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_clerk on public.users(clerk_user_id);

alter table public.users enable row level security;

drop policy if exists "Users are readable by authenticated users"
  on public.users;

create policy "Users are readable by authenticated users"
  on public.users for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users are insertable by authenticated users"
  on public.users;

create policy "Users are insertable by authenticated users"
  on public.users for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Users are updatable by authenticated users"
  on public.users;

create policy "Users are updatable by authenticated users"
  on public.users for update
  using (auth.role() = 'authenticated');

drop policy if exists "Users are deletable by admins"
  on public.users;

create policy "Users are deletable by admins"
  on public.users for delete
  using (
    auth.role() = 'authenticated' and
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- =============================================================================
-- 2. APPS CATALOG
-- =============================================================================
create table if not exists public.apps (
  name text primary key,
  icon text not null,
  description text not null default '',
  color text not null default '',
  url text not null default '',
  downloads jsonb not null default '[]',
  developers jsonb not null default '[]',
  status text default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apps enable row level security;

drop policy if exists "Apps are readable by everyone"
  on public.apps;

create policy "Apps are readable by everyone"
  on public.apps for select
  using (true);

drop policy if exists "Apps are writable by authenticated users"
  on public.apps;

create policy "Apps are writable by authenticated users"
  on public.apps for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Apps are updatable by authenticated users"
  on public.apps;

create policy "Apps are updatable by authenticated users"
  on public.apps for update
  using (auth.role() = 'authenticated');

drop policy if exists "Apps are deletable by admins"
  on public.apps;

create policy "Apps are deletable by admins"
  on public.apps for delete
  using (
    auth.role() = 'authenticated' and
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- =============================================================================
-- 3. APP ASSIGNMENTS (developers & admins assigned to each app)
-- =============================================================================
create table if not exists public.app_assignments (
  id uuid primary key default gen_random_uuid(),
  app_name text not null references public.apps(name) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('developer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(app_name, user_id)
);

create index if not exists idx_app_assignments_app on public.app_assignments(app_name);
create index if not exists idx_app_assignments_user on public.app_assignments(user_id);

alter table public.app_assignments enable row level security;

drop policy if exists "Assignments are readable by authenticated users"
  on public.app_assignments;

create policy "Assignments are readable by authenticated users"
  on public.app_assignments for select
  using (auth.role() = 'authenticated');

drop policy if exists "Assignments are writable by authenticated users"
  on public.app_assignments;

create policy "Assignments are writable by authenticated users"
  on public.app_assignments for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Assignments are updatable by authenticated users"
  on public.app_assignments;

create policy "Assignments are updatable by authenticated users"
  on public.app_assignments for update
  using (auth.role() = 'authenticated');

drop policy if exists "Assignments are deletable by authenticated users"
  on public.app_assignments;

create policy "Assignments are deletable by authenticated users"
  on public.app_assignments for delete
  using (auth.role() = 'authenticated');

-- =============================================================================
-- 4. APP TESTING COMMENTS
-- =============================================================================
create table if not exists public.app_comments (
  id uuid primary key default gen_random_uuid(),
  app_name text not null references public.apps(name) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_app_comments_app on public.app_comments(app_name);
create index if not exists idx_app_comments_user on public.app_comments(user_id);

alter table public.app_comments enable row level security;

drop policy if exists "Comments are readable by authenticated users"
  on public.app_comments;

create policy "Comments are readable by authenticated users"
  on public.app_comments for select
  using (auth.role() = 'authenticated');

drop policy if exists "Comments are writable by authenticated users"
  on public.app_comments;

create policy "Comments are writable by authenticated users"
  on public.app_comments for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Comments are updatable by comment owner"
  on public.app_comments;

create policy "Comments are updatable by comment owner"
  on public.app_comments for update
  using (auth.uid() = user_id);

drop policy if exists "Comments are deletable by comment owner or admin"
  on public.app_comments;

create policy "Comments are deletable by comment owner or admin"
  on public.app_comments for delete
  using (
    auth.uid() = user_id or
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- =============================================================================
-- 5. SERVICES / INTEGRATIONS CATALOG
-- =============================================================================
create table if not exists public.services (
  slug text primary key,
  name text not null,
  description text,
  availability text not null default 'official',
  official boolean not null default true,
  connected boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "Services are readable by everyone"
  on public.services;

create policy "Services are readable by everyone"
  on public.services for select
  using (true);

drop policy if exists "Services are writable by authenticated users"
  on public.services;

create policy "Services are writable by authenticated users"
  on public.services for update
  using (auth.role() = 'authenticated');

-- =============================================================================
-- 6. TASKS
-- =============================================================================
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  status text not null default 'todo' check (status in ('backlog', 'todo', 'in progress', 'done', 'canceled')),
  label text not null default 'feature' check (label in ('bug', 'feature', 'documentation')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  assignee_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_priority on public.tasks(priority);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);

alter table public.tasks enable row level security;

drop policy if exists "Tasks are readable by authenticated users"
  on public.tasks;

create policy "Tasks are readable by authenticated users"
  on public.tasks for select
  using (auth.role() = 'authenticated');

drop policy if exists "Tasks are insertable by authenticated users"
  on public.tasks;

create policy "Tasks are insertable by authenticated users"
  on public.tasks for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Tasks are updatable by authenticated users"
  on public.tasks;

create policy "Tasks are updatable by authenticated users"
  on public.tasks for update
  using (auth.role() = 'authenticated');

drop policy if exists "Tasks are deletable by admins"
  on public.tasks;

create policy "Tasks are deletable by admins"
  on public.tasks for delete
  using (
    auth.role() = 'authenticated' and
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- =============================================================================
-- 7. ISSUES (bug tracking)
-- =============================================================================
create table if not exists public.issues (
  id text primary key,
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open', 'in progress', 'resolved', 'closed')),
  app_name text not null references public.apps(name) on delete cascade,
  screenshot text,
  reporter_id uuid references public.users(id) on delete set null,
  reporter_name text not null default 'You',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_issues_status on public.issues(status);
create index if not exists idx_issues_app on public.issues(app_name);
create index if not exists idx_issues_reporter on public.issues(reporter_id);

alter table public.issues enable row level security;

drop policy if exists "Issues are readable by authenticated users"
  on public.issues;

create policy "Issues are readable by authenticated users"
  on public.issues for select
  using (auth.role() = 'authenticated');

drop policy if exists "Issues are insertable by authenticated users"
  on public.issues;

create policy "Issues are insertable by authenticated users"
  on public.issues for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Issues are updatable by authenticated users"
  on public.issues;

create policy "Issues are updatable by authenticated users"
  on public.issues for update
  using (auth.role() = 'authenticated');

drop policy if exists "Issues are deletable by admins"
  on public.issues;

create policy "Issues are deletable by admins"
  on public.issues for delete
  using (
    auth.role() = 'authenticated' and
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- =============================================================================
-- 8. CHATS / CONVERSATIONS
-- =============================================================================
create table if not exists public.chat_users (
  id text primary key,
  profile text not null default '',
  username text not null,
  full_name text not null,
  title text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chat_users enable row level security;

drop policy if exists "Chat users are readable by authenticated users"
  on public.chat_users;

create policy "Chat users are readable by authenticated users"
  on public.chat_users for select
  using (auth.role() = 'authenticated');

drop policy if exists "Chat users are insertable by authenticated users"
  on public.chat_users;

create policy "Chat users are insertable by authenticated users"
  on public.chat_users for insert
  with check (auth.role() = 'authenticated');

-- Chat messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_user_id text not null references public.chat_users(id) on delete cascade,
  sender text not null,
  message text not null,
  timestamp timestamptz not null default now()
);

create index if not exists idx_chat_messages_user on public.chat_messages(chat_user_id);
create index if not exists idx_chat_messages_timestamp on public.chat_messages(timestamp);

alter table public.chat_messages enable row level security;

drop policy if exists "Messages are readable by authenticated users"
  on public.chat_messages;

create policy "Messages are readable by authenticated users"
  on public.chat_messages for select
  using (auth.role() = 'authenticated');

drop policy if exists "Messages are insertable by authenticated users"
  on public.chat_messages;

create policy "Messages are insertable by authenticated users"
  on public.chat_messages for insert
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- 9. MODELS CATALOG (static reference data)
-- =============================================================================
create table if not exists public.models (
  name text primary key,
  tag text not null default 'latest',
  size text not null,
  context text not null,
  capabilities jsonb not null default '[]',
  category text not null,
  description text not null default '',
  ollama_url text not null default '',
  created_at timestamptz not null default now()
);

alter table public.models enable row level security;

drop policy if exists "Models are readable by everyone"
  on public.models;

create policy "Models are readable by everyone"
  on public.models for select
  using (true);

-- =============================================================================
-- 10. UPDATED_AT TRIGGERS
-- =============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to each table that has an updated_at column
-- Using drop+create for compatibility with PG 14-16
drop trigger if exists on_users_update
  on public.users;

create trigger on_users_update
  before update on public.users
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_apps_update
  on public.apps;

create trigger on_apps_update
  before update on public.apps
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_app_assignments_update
  on public.app_assignments;

create trigger on_app_assignments_update
  before update on public.app_assignments
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_app_comments_update
  on public.app_comments;

create trigger on_app_comments_update
  before update on public.app_comments
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_tasks_update
  on public.tasks;

create trigger on_tasks_update
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_issues_update
  on public.issues;

create trigger on_issues_update
  before update on public.issues
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_chat_users_update
  on public.chat_users;

create trigger on_chat_users_update
  before update on public.chat_users
  for each row execute procedure public.handle_updated_at();

-- =============================================================================
-- 11. SEED DATA
-- =============================================================================

-- Admin user (link Clerk after sign-up by updating clerk_user_id)
insert into public.users (email, first_name, last_name, username, role, status)
values ('admin@eburon.ai', 'Admin', 'User', 'admin', 'admin', 'active')
on conflict (email) do nothing;

-- Developer user (Emil Alvaro)
insert into public.users (email, first_name, last_name, username, role, status)
values ('emil.alvaro@eburon.ai', 'Emil', 'Alvaro', 'emilalvaro', 'developer', 'active')
on conflict (email) do nothing;

-- Seed integration catalog
insert into public.services (slug, name, description, availability, official, connected)
values
  ('data_api', 'Data API', 'Auto-generate an API directly from your database schema.', 'installed', true, false),
  ('vault', 'Vault', 'Application level encryption for your project.', 'beta', true, false),
  ('airtable_wrapper', 'Airtable Wrapper', 'No-code database and spreadsheet platform.', 'official', true, false),
  ('auth0_wrapper', 'Auth0 Wrapper', 'Identity and access management platform.', 'official', true, false),
  ('bigquery_wrapper', 'BigQuery Wrapper', 'Serverless data warehouse and analytics.', 'official', true, false),
  ('cal_wrapper', 'Cal.com Wrapper', 'Cal.com is a scheduling platform.', 'official', true, false),
  ('calendly_wrapper', 'Calendly Wrapper', 'Calendly is a scheduling platform.', 'official', true, false),
  ('clerk_wrapper', 'Clerk Wrapper', 'User Management Platform.', 'official', true, false),
  ('clickhouse_wrapper', 'ClickHouse Wrapper', 'Column-oriented analytics database.', 'official', true, false),
  ('cfd1_wrapper', 'Cloudflare D1 Wrapper', 'Read and write data from Cloudflare D1 databases using the Wasm FDW.', 'official', true, false),
  ('cognito_wrapper', 'Cognito Wrapper', 'AWS user authentication and authorization.', 'official', true, false),
  ('cron', 'Cron', 'Schedule recurring Jobs in Postgres.', 'official', true, false),
  ('database_webhooks', 'Database Webhooks', 'Send real-time data from your database to another system when a table event occurs.', 'official', true, false),
  ('firebase_wrapper', 'Firebase Wrapper', 'Backend-as-a-Service with real-time database.', 'official', true, false),
  ('graphiql', 'GraphiQL', 'Run GraphQL queries through our interactive in-browser IDE.', 'official', true, false),
  ('hubspot_wrapper', 'HubSpot Wrapper', 'Query and sync HubSpot CRM data using the Wasm FDW.', 'official', true, false),
  ('iceberg_wrapper', 'Iceberg Wrapper', 'Iceberg is a data warehouse.', 'official', true, false),
  ('logflare_wrapper', 'Logflare Wrapper', 'Log management and analytics service.', 'official', true, false),
  ('mssql_wrapper', 'Microsoft SQL Server Wrapper', 'Microsoft SQL Server database.', 'official', true, false),
  ('notion_wrapper', 'Notion Wrapper', 'Notion provides a versatile, ready-to-use solution for managing your data.', 'official', true, false),
  ('orb_wrapper', 'Orb Wrapper', 'Usage-based billing and metering platform.', 'official', true, false),
  ('paddle_wrapper', 'Paddle Wrapper', 'Subscription billing and payments platform.', 'official', true, false),
  ('queues', 'Queues', 'Lightweight message queue in Postgres.', 'official', true, false),
  ('redis_wrapper', 'Redis Wrapper', 'In-memory data structure store.', 'official', true, false),
  ('s3_vectors_wrapper', 'S3 Vectors Wrapper', 'Cloud storage service for high-dimensional vectors.', 'official', true, false),
  ('s3_wrapper', 'S3 Wrapper', 'Cloud object storage service.', 'official', true, false),
  ('slack_wrapper', 'Slack Wrapper', 'Query Slack workspaces, channels, messages, users, files, and more via the Slack API.', 'official', true, false),
  ('snowflake_wrapper', 'Snowflake Wrapper', 'Cloud data warehouse platform.', 'official', true, false),
  ('stripe_sync_engine', 'Stripe Sync Engine', 'Continuously sync your payments, customer, and other data from Stripe to your Postgres database.', 'alpha', true, false),
  ('stripe_wrapper', 'Stripe Wrapper', 'Payment processing and subscription management.', 'official', true, false)
on conflict (slug) do nothing;
