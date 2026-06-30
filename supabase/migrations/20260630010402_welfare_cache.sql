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

create index if not exists welfare_services_source_idx on public.welfare_services (source);
create index if not exists welfare_services_region_idx on public.welfare_services (ctpv_nm, sgg_nm);
create index if not exists welfare_services_deadline_idx on public.welfare_services (apply_end_dd) where apply_end_dd is not null;
create index if not exists welfare_services_modified_idx on public.welfare_services (last_mod_ymd) where last_mod_ymd is not null;
create index if not exists welfare_services_fetched_idx on public.welfare_services (fetched_at);

create or replace function public.set_welfare_services_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
grant select on public.welfare_services to anon, authenticated;
grant all on public.welfare_services to service_role;

create or replace view public.welfare_deadlines
with (security_invoker = true)
as
select *
from public.welfare_services
where is_always = false
  and apply_end_dd is not null
  and apply_end_dd >= to_char(current_date, 'YYYYMMDD')
order by apply_end_dd asc;

create or replace view public.welfare_new
with (security_invoker = true)
as
select *
from public.welfare_services
where last_mod_ymd is not null
  and last_mod_ymd >= to_char(current_date - interval '30 days', 'YYYYMMDD')
order by last_mod_ymd desc;

create table if not exists public.popular_services (
  cache_key text primary key references public.welfare_services(cache_key) on delete cascade,
  view_count bigint not null default 0,
  click_count bigint not null default 0,
  save_count bigint not null default 0,
  score numeric generated always as ((view_count * 1) + (click_count * 3) + (save_count * 5)) stored,
  updated_at timestamptz not null default now()
);

create index if not exists popular_services_score_idx on public.popular_services (score desc);

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

grant select on public.popular_services to anon, authenticated;
grant all on public.popular_services to service_role;
grant select on public.welfare_deadlines to anon, authenticated;
grant select on public.welfare_new to anon, authenticated;
