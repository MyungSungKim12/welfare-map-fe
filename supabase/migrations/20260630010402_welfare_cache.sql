create table if not exists public.welfare_services (
  cache_key text primary key,
  service_id text not null,
  source text not null check (source in ('local', 'national')),
  title text not null,
  category text not null default '기타',
  target text not null default '전체',
  period text not null default '확인 필요',
  region text not null default '전국',
  ctpv_nm text,
  sgg_nm text,
  summary text not null default '',
  link text not null default '',
  apply_end_dd text,
  last_mod_ymd text,
  is_always boolean not null default false,
  raw_data jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.welfare_services add column if not exists cache_key text;
alter table public.welfare_services add column if not exists service_id text;
alter table public.welfare_services add column if not exists source text;
alter table public.welfare_services add column if not exists title text;
alter table public.welfare_services add column if not exists period text;
alter table public.welfare_services add column if not exists region text;
alter table public.welfare_services add column if not exists ctpv_nm text;
alter table public.welfare_services add column if not exists sgg_nm text;
alter table public.welfare_services add column if not exists summary text;
alter table public.welfare_services add column if not exists link text;
alter table public.welfare_services add column if not exists raw_data jsonb not null default '{}'::jsonb;
alter table public.welfare_services add column if not exists fetched_at timestamptz not null default now();

alter table public.welfare_services alter column source set default 'local';
alter table public.welfare_services alter column title set default '';
alter table public.welfare_services alter column category set default '기타';
alter table public.welfare_services alter column target set default '전체';
alter table public.welfare_services alter column period set default '확인 필요';
alter table public.welfare_services alter column region set default '전국';
alter table public.welfare_services alter column summary set default '';
alter table public.welfare_services alter column link set default '';

create unique index if not exists welfare_services_cache_key_uidx on public.welfare_services (cache_key);
create index if not exists welfare_services_source_idx on public.welfare_services (source);
create index if not exists welfare_services_region_idx on public.welfare_services (ctpv_nm, sgg_nm);
create index if not exists welfare_services_deadline_idx on public.welfare_services (apply_end_dd) where apply_end_dd is not null;
create index if not exists welfare_services_modified_idx on public.welfare_services (last_mod_ymd) where last_mod_ymd is not null;
create index if not exists welfare_services_fetched_idx on public.welfare_services (fetched_at);

create or replace function public.set_welfare_services_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if to_regprocedure('public.update_updated_at()') is not null then
    execute 'alter function public.update_updated_at() set search_path = public';
  end if;
end $$;

drop trigger if exists welfare_services_set_updated_at on public.welfare_services;
create trigger welfare_services_set_updated_at
before update on public.welfare_services
for each row
execute function public.set_welfare_services_updated_at();

revoke all on function public.set_welfare_services_updated_at() from public;

alter table public.welfare_services enable row level security;

drop policy if exists "Public cache rows are readable" on public.welfare_services;
create policy "Public cache rows are readable"
on public.welfare_services
for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated, service_role;
revoke all on table public.welfare_services from anon, authenticated;
grant select on public.welfare_services to anon, authenticated;
grant all on public.welfare_services to service_role;

create table if not exists public.welfare_deadlines (
  id uuid primary key default gen_random_uuid(),
  cache_key text,
  service_id text,
  apply_end_dd text,
  d_day integer,
  created_at timestamptz not null default now()
);

create table if not exists public.welfare_new (
  id uuid primary key default gen_random_uuid(),
  cache_key text,
  service_id text,
  last_mod_ymd text,
  created_at timestamptz not null default now()
);

alter table public.welfare_deadlines enable row level security;
alter table public.welfare_new enable row level security;

drop policy if exists "Welfare deadlines are readable" on public.welfare_deadlines;
create policy "Welfare deadlines are readable"
on public.welfare_deadlines
for select
to anon, authenticated
using (true);

drop policy if exists "New welfare rows are readable" on public.welfare_new;
create policy "New welfare rows are readable"
on public.welfare_new
for select
to anon, authenticated
using (true);

create table if not exists public.popular_services (
  cache_key text primary key references public.welfare_services(cache_key) on delete cascade,
  view_count bigint not null default 0,
  click_count bigint not null default 0,
  save_count bigint not null default 0,
  score numeric generated always as ((view_count * 1) + (click_count * 3) + (save_count * 5)) stored,
  updated_at timestamptz not null default now()
);

alter table public.popular_services add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_popular_services_score on public.popular_services (score desc);
drop index if exists public.popular_services_score_idx;

drop trigger if exists popular_services_set_updated_at on public.popular_services;
create trigger popular_services_set_updated_at
before update on public.popular_services
for each row
execute function public.set_welfare_services_updated_at();

alter table public.popular_services enable row level security;

drop policy if exists "Popular service counters are readable" on public.popular_services;
create policy "Popular service counters are readable"
on public.popular_services
for select
to anon, authenticated
using (true);

revoke all on table public.popular_services from anon, authenticated;
revoke all on table public.welfare_deadlines from anon, authenticated;
revoke all on table public.welfare_new from anon, authenticated;

grant select on public.popular_services to anon, authenticated;
grant all on public.popular_services to service_role;
grant select on public.welfare_deadlines to anon, authenticated;
grant select on public.welfare_new to anon, authenticated;
grant all on public.welfare_deadlines to service_role;
grant all on public.welfare_new to service_role;

do $$
declare
  private_table text;
begin
  foreach private_table in array array[
    'users',
    'user_locations',
    'saved_services',
    'service_views',
    'service_clicks',
    'search_logs',
    'batch_logs'
  ]
  loop
    if to_regclass(format('public.%I', private_table)) is not null then
      execute format('alter table public.%I enable row level security', private_table);
      execute format('revoke all on table public.%I from anon, authenticated', private_table);
      execute format('grant all on table public.%I to service_role', private_table);
    end if;
  end loop;
end $$;
