-- ==============================================================================
-- Unified Portfolio & Admin CMS — Supabase PostgreSQL Schema
-- ==============================================================================
-- Run this in Supabase Dashboard -> SQL Editor.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Admin Users & Helper Function
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

-- ------------------------------------------------------------------------------
-- 2. Singleton Tables: profile, site_settings
-- ------------------------------------------------------------------------------
create table if not exists public.profile (
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  logo jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  favicon jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  theme jsonb not null default '{"primaryColor": "#6366F1", "secondaryColor": "#8B5CF6", "accentColor": "#F59E0B", "fontFamily": "Inter"}'::jsonb,
  footer_text text not null default '',
  footer_links jsonb not null default '[]'::jsonb,
  nav_items jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{"metaTitle": "", "metaDescription": "", "ogImage": {"url": null, "publicId": null, "alt": ""}}'::jsonb,
  hero jsonb not null default '{"headline": "", "subheadline": "", "ctaText": "", "ctaLink": "", "backgroundImage": {"url": null, "publicId": null, "alt": ""}}'::jsonb,
  github_username text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. Sections
-- ------------------------------------------------------------------------------
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.sections (key, label, "order", is_visible)
values
  ('home', 'Home', 0, true),
  ('about', 'About', 1, true),
  ('projects', 'Projects', 2, true),
  ('experience', 'Experience', 3, true),
  ('certificates', 'Certificates', 4, true),
  ('testimonials', 'Testimonials', 5, true),
  ('blog', 'Blog', 6, true),
  ('contact', 'Contact', 7, true)
on conflict (key) do update set
  label = excluded.label,
  "order" = excluded."order";

-- ------------------------------------------------------------------------------
-- 4. Content Modules
-- ------------------------------------------------------------------------------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null default '',
  field_of_study text not null default '',
  start_date timestamptz,
  end_date timestamptz,
  grade text not null default '',
  description text not null default '',
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  proficiency integer not null default 80,
  icon text not null default '',
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  long_description text not null default '',
  cover_image jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  screenshots jsonb not null default '[]'::jsonb,
  report_pdf jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  video_url text not null default '',
  github_url text not null default '',
  live_demo_url text not null default '',
  technologies text[] not null default '{}',
  category text not null default 'General',
  is_featured boolean not null default false,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  seo jsonb not null default '{"metaTitle": "", "metaDescription": "", "ogImage": {"url": null, "publicId": null, "alt": ""}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text not null default '',
  start_date timestamptz,
  end_date timestamptz,
  is_current boolean not null default false,
  description text not null default '',
  responsibilities text[] not null default '{}',
  technologies text[] not null default '{}',
  proof_file jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  proof_url text not null default '',
  github_urls text[] not null default '{}',
  related_projects jsonb not null default '[]'::jsonb,
  project_report_url text not null default '',
  project_report_pdf jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  certificate jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  attachments jsonb not null default '[]'::jsonb,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  image jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  credential_url text not null default '',
  issue_date timestamptz,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  date timestamptz,
  icon text not null default '',
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  caption text not null default '',
  category text not null default 'General',
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  category text not null default 'General',
  tags text[] not null default '{}',
  seo jsonb not null default '{"metaTitle": "", "metaDescription": "", "ogImage": {"url": null, "publicId": null, "alt": ""}}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  file jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  label text not null default '',
  is_active boolean not null default false,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coding_profiles (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  username text not null default '',
  profile_url text not null,
  icon text not null default '',
  stats jsonb not null default '{}'::jsonb,
  "order" integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  company text not null default '',
  email text not null default '',
  linkedin_url text not null default '',
  github_url text not null default '',
  message text not null,
  avatar jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. Messages, Analytics, Activity Log, Notifications
-- ------------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('page_view', 'project_view', 'resume_download')),
  ref_id uuid,
  visitor_hash text not null,
  path text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_type_created on public.analytics_events (type, created_at desc);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid,
  admin_email text default '',
  action text not null,
  resource text not null,
  resource_id text,
  description text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_created on public.activity_logs (created_at desc);

create table if not exists public.system_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  message text not null,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- ------------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.site_settings enable row level security;
alter table public.sections enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.certificates enable row level security;
alter table public.achievements enable row level security;
alter table public.gallery_images enable row level security;
alter table public.blog_posts enable row level security;
alter table public.resume_versions enable row level security;
alter table public.coding_profiles enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.analytics_events enable row level security;
alter table public.activity_logs enable row level security;
alter table public.system_notifications enable row level security;

-- Public read policies for visible portfolio content
create policy "Public read profile" on public.profile for select using (true);
create policy "Public read settings" on public.site_settings for select using (true);
create policy "Public read sections" on public.sections for select using (true);
create policy "Public read education" on public.education for select using (is_visible = true);
create policy "Public read skills" on public.skills for select using (is_visible = true);
create policy "Public read projects" on public.projects for select using (is_visible = true);
create policy "Public read experience" on public.experience for select using (is_visible = true);
create policy "Public read certificates" on public.certificates for select using (is_visible = true);
create policy "Public read achievements" on public.achievements for select using (is_visible = true);
create policy "Public read gallery" on public.gallery_images for select using (is_visible = true);
create policy "Public read published blog" on public.blog_posts for select using (status = 'published');
create policy "Public read active resume" on public.resume_versions for select using (is_active = true);
create policy "Public read coding profiles" on public.coding_profiles for select using (is_visible = true);
create policy "Public read approved testimonials" on public.testimonials for select using (status = 'approved' and is_visible = true);

-- Public insert policies (contact form, testimonial submission, analytics)
create policy "Public submit contact" on public.contact_messages for insert with check (true);
create policy "Public submit testimonial" on public.testimonials for insert with check (status = 'pending');
create policy "Public log analytics" on public.analytics_events for insert with check (true);

-- Admin full-access policies
create policy "Admin all admin_users" on public.admin_users for all using (auth.uid() = id or public.is_admin());
create policy "Admin all profile" on public.profile for all using (public.is_admin());
create policy "Admin all settings" on public.site_settings for all using (public.is_admin());
create policy "Admin all sections" on public.sections for all using (public.is_admin());
create policy "Admin all education" on public.education for all using (public.is_admin());
create policy "Admin all skills" on public.skills for all using (public.is_admin());
create policy "Admin all projects" on public.projects for all using (public.is_admin());
create policy "Admin all experience" on public.experience for all using (public.is_admin());
create policy "Admin all certificates" on public.certificates for all using (public.is_admin());
create policy "Admin all achievements" on public.achievements for all using (public.is_admin());
create policy "Admin all gallery" on public.gallery_images for all using (public.is_admin());
create policy "Admin all blog" on public.blog_posts for all using (public.is_admin());
create policy "Admin all resume" on public.resume_versions for all using (public.is_admin());
create policy "Admin all coding_profiles" on public.coding_profiles for all using (public.is_admin());
create policy "Admin all testimonials" on public.testimonials for all using (public.is_admin());
create policy "Admin all messages" on public.contact_messages for all using (public.is_admin());
create policy "Admin all analytics" on public.analytics_events for all using (public.is_admin());
create policy "Admin all activity_logs" on public.activity_logs for all using (public.is_admin());
create policy "Admin all notifications" on public.system_notifications for all using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. Supabase Storage Bucket (portfolio-media)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "Public read portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "Authenticated upload portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media');

create policy "Admin delete portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. Schema & Table Grants (required when auto-grant is disabled on project)
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;
