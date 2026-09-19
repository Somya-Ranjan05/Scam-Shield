-- ============================================================
-- ScamShield Production Schema (Supabase / PostgreSQL)
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fuzzy text matching on reports

-- ------------------------------------------------------------
-- ENUM TYPES
-- ------------------------------------------------------------
do $$ begin
  create type submission_type as enum (
    'text', 'link', 'qr_code', 'voice', 'apk'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type scam_category as enum (
    'phishing_link', 'fake_banking_upi', 'lottery_prize_scam',
    'impersonation_call', 'malicious_apk', 'job_investment_fraud',
    'qr_code_scam', 'romance_social_engineering', 'other'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type risk_tier as enum (
    'safe', 'suspicious', 'dangerous', 'confirmed_scam'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type report_status as enum (
    'pending_review', 'community_verified', 'admin_verified', 'rejected'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type app_role as enum ('user', 'admin');
exception
  when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- PROFILES (extends Supabase auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'en',
  role app_role not null default 'user',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SUBMISSIONS (every check a user or anonymous visitor makes)
-- ------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null, -- null = anonymous
  submission_type submission_type not null,

  -- raw inputs (only the relevant column(s) populated per type)
  raw_text text,
  raw_url text,
  qr_decoded_payload text,
  audio_storage_path text,
  transcribed_text text,
  apk_filename text,
  apk_package_name text,
  apk_source_link text,

  sender_id text,
  additional_context text,
  preferred_language text not null default 'en',

  -- normalized fields used for threat matching
  normalized_domain text,
  normalized_phone text,

  created_at timestamptz not null default now(),
  client_ip_hash text -- hashed, never raw IP, used only for rate limiting audits
);

create index if not exists idx_submissions_user on public.submissions(user_id);
create index if not exists idx_submissions_domain on public.submissions(normalized_domain);
create index if not exists idx_submissions_phone on public.submissions(normalized_phone);

-- ------------------------------------------------------------
-- VERDICTS (immutable AI output per submission)
-- ------------------------------------------------------------
create table if not exists public.verdicts (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  scam_category scam_category not null,
  risk_score int not null check (risk_score >= 0 and risk_score <= 100),
  risk_tier risk_tier not null,
  headline_verdict text not null,
  red_flags jsonb not null default '[]'::jsonb,
  explanation text not null,
  recommended_action jsonb not null default '[]'::jsonb,
  confidence_level text not null,
  community_match_boost int not null default 0,
  language text not null default 'en',
  raw_model_response jsonb not null, -- full Gemini JSON, for audit/debugging
  model_name text not null,
  created_at timestamptz not null default now(),
  unique(submission_id)
);

create index if not exists idx_verdicts_submission on public.verdicts(submission_id);

-- ------------------------------------------------------------
-- SCAM REPORTS (community-facing, drives the public registry)
-- ------------------------------------------------------------
create table if not exists public.scam_reports (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  reported_by uuid not null references auth.users(id) on delete cascade,
  scam_category scam_category not null,
  other_category_note text,
  public_summary text not null, -- sanitized, PII-scrubbed summary shown publicly
  status report_status not null default 'pending_review',
  report_count int not null default 1, -- incremented when duplicate signatures are reported
  threat_signature text not null, -- normalized domain/phone/apk-package used for de-duplication
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_reports_signature on public.scam_reports(threat_signature);
create index if not exists idx_reports_status on public.scam_reports(status);
create index if not exists idx_reports_summary_trgm on public.scam_reports using gin (public_summary gin_trgm_ops);

-- ------------------------------------------------------------
-- THREAT SIGNATURES (denormalized lookup for fast matching)
-- ------------------------------------------------------------
create table if not exists public.threat_signatures (
  id uuid primary key default uuid_generate_v4(),
  signature text not null unique, -- normalized domain / phone / apk package
  scam_category scam_category not null,
  total_reports int not null default 1,
  highest_risk_score int not null default 0,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_threat_sig_lookup on public.threat_signatures(signature);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.submissions enable row level security;
alter table public.verdicts enable row level security;
alter table public.scam_reports enable row level security;
alter table public.threat_signatures enable row level security;

-- PROFILES: users can read/update only their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- SUBMISSIONS: owners can read their own; anonymous submissions (user_id null)
-- are readable only via direct result query through backend service-role.
drop policy if exists "submissions_select_own" on public.submissions;
create policy "submissions_select_own" on public.submissions
  for select using (auth.uid() = user_id);

drop policy if exists "submissions_insert_own_or_anon" on public.submissions;
create policy "submissions_insert_own_or_anon" on public.submissions
  for insert with check (auth.uid() = user_id or user_id is null);

-- VERDICTS: readable only by the owning user, joined through submissions.
drop policy if exists "verdicts_select_via_submission_owner" on public.verdicts;
create policy "verdicts_select_via_submission_owner" on public.verdicts
  for select using (
    exists (
      select 1 from public.submissions s
      where s.id = verdicts.submission_id and s.user_id = auth.uid()
    )
  );

-- SCAM_REPORTS: anyone can read public reports ('community_verified', 'admin_verified').
drop policy if exists "reports_select_public" on public.scam_reports;
create policy "reports_select_public" on public.scam_reports
  for select using (status in ('community_verified', 'admin_verified'));

drop policy if exists "reports_select_own_pending" on public.scam_reports;
create policy "reports_select_own_pending" on public.scam_reports
  for select using (auth.uid() = reported_by);

drop policy if exists "reports_insert_own" on public.scam_reports;
create policy "reports_insert_own" on public.scam_reports
  for insert with check (auth.uid() = reported_by);

drop policy if exists "reports_update_admin_only" on public.scam_reports;
create policy "reports_update_admin_only" on public.scam_reports
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- THREAT_SIGNATURES: public read-only (aggregate, non-PII data)
drop policy if exists "threat_sig_select_all" on public.threat_signatures;
create policy "threat_sig_select_all" on public.threat_signatures
  for select using (true);

-- Auto profile creation trigger on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, preferred_language, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'en'),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
