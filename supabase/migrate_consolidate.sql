-- ==============================================================================
-- Migration: Consolidate 19 Supabase tables into 11 clean tables
-- ==============================================================================
-- Run this once in Supabase Dashboard -> SQL Editor.

begin;

-- 1. Create public.about and migrate profile + education + skills + coding_profiles + resume_versions
create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  title text not null default '',
  about_me text not null default '',
  career_objective text not null default '',
  profile_photo jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  cover_banner jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  social_links jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  coding_profiles jsonb not null default '[]'::jsonb,
  resume_versions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  edu_json jsonb := '[]'::jsonb;
  skills_json jsonb := '[]'::jsonb;
  coding_json jsonb := '[]'::jsonb;
  resume_json jsonb := '[]'::jsonb;
begin
  if to_regclass('public.education') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      '_id', id, 'id', id, 'institution', institution, 'degree', degree,
      'fieldOfStudy', field_of_study, 'startDate', start_date, 'endDate', end_date,
      'grade', grade, 'description', description, 'order', "order",
      'isVisible', is_visible, 'createdAt', created_at, 'updatedAt', updated_at
    ) order by "order" asc), '[]'::jsonb) into edu_json from public.education;
  end if;

  if to_regclass('public.skills') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      '_id', id, 'id', id, 'name', name, 'category', category,
      'proficiency', proficiency, 'icon', icon, 'order', "order",
      'isVisible', is_visible, 'createdAt', created_at, 'updatedAt', updated_at
    ) order by "order" asc), '[]'::jsonb) into skills_json from public.skills;
  end if;

  if to_regclass('public.coding_profiles') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      '_id', id, 'id', id, 'platform', platform, 'username', username,
      'profileUrl', profile_url, 'icon', icon, 'stats', stats, 'order', "order",
      'isVisible', is_visible, 'createdAt', created_at, 'updatedAt', updated_at
    ) order by "order" asc), '[]'::jsonb) into coding_json from public.coding_profiles;
  end if;

  if to_regclass('public.resume_versions') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      '_id', id, 'id', id, 'file', file, 'label', label,
      'isActive', is_active, 'uploadedAt', uploaded_at,
      'createdAt', created_at, 'updatedAt', updated_at
    ) order by uploaded_at desc), '[]'::jsonb) into resume_json from public.resume_versions;
  end if;

  if (select count(*) from public.about) = 0 then
    if to_regclass('public.profile') is not null and exists (select 1 from public.profile) then
      insert into public.about (
        name, title, about_me, career_objective, profile_photo, cover_banner,
        email, phone, location, social_links, education, skills, coding_profiles, resume_versions
      )
      select
        name, title, about_me, career_objective, profile_photo, cover_banner,
        email, phone, location, social_links, edu_json, skills_json, coding_json, resume_json
      from public.profile
      limit 1;
    else
      insert into public.about (education, skills, coding_profiles, resume_versions)
      values (edu_json, skills_json, coding_json, resume_json);
    end if;
  end if;
end $$;

alter table public.about enable row level security;
drop policy if exists "Public read about" on public.about;
create policy "Public read about" on public.about for select using (true);
drop policy if exists "Admin all about" on public.about;
create policy "Admin all about" on public.about for all using (public.is_admin());

-- 2. Merge achievements into public.experience
alter table public.experience
  add column if not exists entry_type text not null default 'experience',
  add column if not exists title text not null default '',
  add column if not exists date timestamptz,
  add column if not exists icon text not null default '';

alter table public.experience
  alter column company set default '',
  alter column role set default '';

do $$
begin
  if to_regclass('public.achievements') is not null then
    insert into public.experience (
      id, entry_type, title, description, date, icon, "order", is_visible, created_at, updated_at
    )
    select
      id, 'achievement', title, description, date, icon, "order", is_visible, created_at, updated_at
    from public.achievements
    on conflict (id) do nothing;
  end if;
end $$;

-- 3. Merge sections into public.site_settings
alter table public.site_settings
  add column if not exists sections jsonb not null default '[]'::jsonb;

do $$
declare
  sec_json jsonb := '[]'::jsonb;
begin
  if to_regclass('public.sections') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      '_id', id, 'id', id, 'key', key, 'label', label,
      'order', "order", 'isVisible', is_visible,
      'createdAt', created_at, 'updatedAt', updated_at
    ) order by "order" asc), '[]'::jsonb) into sec_json from public.sections;

    update public.site_settings set sections = sec_json;
  end if;
end $$;

-- 4. Drop obsolete tables
drop table if exists public.gallery_images cascade;
drop table if exists public.system_notifications cascade;
drop table if exists public.education cascade;
drop table if exists public.skills cascade;
drop table if exists public.coding_profiles cascade;
drop table if exists public.resume_versions cascade;
drop table if exists public.achievements cascade;
drop table if exists public.sections cascade;
drop table if exists public.profile cascade;

-- 5. Add soft-delete (is_archived, archived_at) columns to content tables
alter table public.projects add column if not exists is_archived boolean not null default false, add column if not exists archived_at timestamptz;
alter table public.experience add column if not exists is_archived boolean not null default false, add column if not exists archived_at timestamptz;
alter table public.certificates add column if not exists is_archived boolean not null default false, add column if not exists archived_at timestamptz;
alter table public.blog_posts add column if not exists is_archived boolean not null default false, add column if not exists archived_at timestamptz;
alter table public.testimonials add column if not exists is_archived boolean not null default false, add column if not exists archived_at timestamptz;
alter table public.contact_messages add column if not exists is_archived boolean not null default false, add column if not exists archived_at timestamptz;

-- 6. Create admin_notes table with soft-delete support
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notebook text not null default 'Personal Notes',
  content text not null default '',
  tags text[] not null default '{}',
  status text not null default 'Published' check (status in ('Published', 'Draft')),
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_notes
  add column if not exists notebook text not null default 'Personal Notes',
  add column if not exists tags text[] not null default '{}',
  add column if not exists status text not null default 'Published';

alter table public.admin_notes enable row level security;
drop policy if exists "Admin all admin_notes" on public.admin_notes;
create policy "Admin all admin_notes" on public.admin_notes for all using (public.is_admin());

-- 7. Full Analytics tables (page_views, section_views, extended analytics_events)
alter table public.analytics_events
  drop constraint if exists analytics_events_type_check;
alter table public.analytics_events
  add column if not exists event_type text not null default '',
  add column if not exists session_id text not null default '',
  add column if not exists target_id text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  path text not null,
  title text not null default '',
  referrer text not null default 'Direct',
  browser text not null default 'Unknown',
  os text not null default 'Unknown',
  device_type text not null default 'Desktop',
  country text not null default 'Unknown',
  created_at timestamptz not null default now()
);
create index if not exists idx_page_views_created on public.page_views (created_at desc);

create table if not exists public.section_views (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  section_id text not null,
  time_spent_ms integer not null default 0,
  max_scroll_depth_percent integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_section_views_created on public.section_views (created_at desc);

alter table public.page_views enable row level security;
alter table public.section_views enable row level security;
drop policy if exists "Public log page_views" on public.page_views;
create policy "Public log page_views" on public.page_views for insert with check (true);
drop policy if exists "Public log section_views" on public.section_views;
create policy "Public log section_views" on public.section_views for insert with check (true);
drop policy if exists "Admin all page_views" on public.page_views;
create policy "Admin all page_views" on public.page_views for all using (public.is_admin());
drop policy if exists "Admin all section_views" on public.section_views;
create policy "Admin all section_views" on public.section_views for all using (public.is_admin());

-- 8. Certificates slug and homepage sort order
alter table public.certificates
  add column if not exists slug text not null default '',
  add column if not exists home_order integer;

update public.certificates
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug = '' or slug is null;

with ranked as (
  select id, slug,
         row_number() over (partition by slug order by created_at asc, id asc) as rn
  from public.certificates
)
update public.certificates c
set slug = r.slug || '-' || r.rn
from ranked r
where c.id = r.id and r.rn > 1;

create unique index if not exists certificates_slug_key on public.certificates(slug);

-- 9. Testimonials unique slug
alter table public.testimonials
  add column if not exists slug text not null default '';

update public.testimonials
set slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where slug = '' or slug is null;

with ranked_testimonials as (
  select id, slug,
         row_number() over (partition by slug order by created_at asc, id asc) as rn
  from public.testimonials
)
update public.testimonials t
set slug = r.slug || '-' || r.rn
from ranked_testimonials r
where t.id = r.id and r.rn > 1;

create unique index if not exists testimonials_slug_key on public.testimonials(slug);

-- 10. Non-negative sort orders
update public.projects set "order" = 0 where "order" < 0;
update public.experience set "order" = 0 where "order" < 0;
update public.certificates set "order" = 0 where "order" < 0;
update public.certificates set home_order = 0 where home_order < 0;

do $$ begin
  alter table public.projects add constraint projects_order_non_negative check ("order" >= 0);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.experience add constraint experience_order_non_negative check ("order" >= 0);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.certificates add constraint certificates_order_non_negative check ("order" >= 0);
exception when duplicate_object then null;
end $$;
do $$ begin
  alter table public.certificates add constraint certificates_home_order_non_negative check (home_order is null or home_order >= 0);
exception when duplicate_object then null;
end $$;

-- 11. Experience unique slug
alter table public.experience
  add column if not exists slug text not null default '';

update public.experience
set slug = trim(both '-' from regexp_replace(lower(coalesce(nullif(role, ''), nullif(title, ''), nullif(company, ''), id::text)), '[^a-z0-9]+', '-', 'g'))
where slug = '' or slug is null;

with ranked_experience as (
  select id, slug,
         row_number() over (partition by slug order by created_at asc, id asc) as rn
  from public.experience
)
update public.experience e
set slug = r.slug || '-' || r.rn
from ranked_experience r
where e.id = r.id and r.rn > 1;

create unique index if not exists experience_slug_key on public.experience(slug);

-- 12. Certificates event photos gallery and section heading
alter table public.certificates
  add column if not exists gallery_heading text not null default '',
  add column if not exists event_photos jsonb not null default '[]'::jsonb;

-- 13. Projects and Testimonials sort order and home_order
alter table public.projects
  add column if not exists home_order integer check (home_order is null or home_order >= 0);

alter table public.testimonials
  add column if not exists "order" integer not null default 0 check ("order" >= 0),
  add column if not exists home_order integer check (home_order is null or home_order >= 0);

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

commit;
