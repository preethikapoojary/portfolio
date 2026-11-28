-- ==============================================================================
-- Unified Portfolio & Admin CMS — Consolidated Supabase PostgreSQL Schema
-- ==============================================================================
-- 11 clean tables matching the public site & Admin Panel structure.

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
-- 2. About (Profile + Education + Skills + Coding Profiles + Resume Versions)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. Site Settings (Settings + Ordered Navigation Sections)
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Portfolio',
  theme jsonb not null default '{"primaryColor": "#6366F1", "secondaryColor": "#0F172A", "accentColor": "#22D3EE"}'::jsonb,
  hero jsonb not null default '{"greeting": "Hi, I''m", "tagline": "", "ctaText": "View Projects"}'::jsonb,
  github_username text not null default '',
  seo jsonb not null default '{"metaTitle": "", "metaDescription": ""}'::jsonb,
  sections jsonb not null default '[
    {"key": "home", "label": "Home", "order": 0, "isVisible": true},
    {"key": "about", "label": "About", "order": 1, "isVisible": true},
    {"key": "projects", "label": "Projects", "order": 2, "isVisible": true},
    {"key": "experience", "label": "Experience", "order": 3, "isVisible": true},
    {"key": "certificates", "label": "Certificates", "order": 4, "isVisible": true},
    {"key": "testimonials", "label": "Testimonials", "order": 5, "isVisible": true},
    {"key": "blog", "label": "Blog", "order": 6, "isVisible": true},
    {"key": "contact", "label": "Contact", "order": 7, "isVisible": true}
  ]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. Content Modules
-- ------------------------------------------------------------------------------
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
  "order" integer not null default 0 check ("order" >= 0),
  home_order integer check (home_order is null or home_order >= 0),
  is_visible boolean not null default true,
  is_archived boolean not null default false,
  archived_at timestamptz,
  seo jsonb not null default '{"metaTitle": "", "metaDescription": "", "ogImage": {"url": null, "publicId": null, "alt": ""}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Holds both Internships/Roles (entry_type = 'experience') and Honors/Hackathons (entry_type = 'achievement')
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null default 'experience' check (entry_type in ('experience', 'achievement')),
  company text not null default '',
  role text not null default '',
  title text not null default '',
  slug text not null unique,
  location text not null default '',
  start_date timestamptz,
  end_date timestamptz,
  date timestamptz,
  is_current boolean not null default false,
  description text not null default '',
  icon text not null default '',
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
  "order" integer not null default 0 check ("order" >= 0),
  home_order integer check (home_order is null or home_order >= 0),
  is_visible boolean not null default true,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  issuer text not null default '',
  image jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  credential_url text not null default '',
  issue_date timestamptz,
  "order" integer not null default 0 check ("order" >= 0),
  home_order integer check (home_order is null or home_order >= 0),
  gallery_heading text not null default '',
  event_photos jsonb not null default '[]'::jsonb,
  is_visible boolean not null default true,
  is_archived boolean not null default false,
  archived_at timestamptz,
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
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  role text not null default '',
  company text not null default '',
  email text not null default '',
  linkedin_url text not null default '',
  github_url text not null default '',
  message text not null,
  avatar jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  "order" integer not null default 0 check ("order" >= 0),
  home_order integer check (home_order is null or home_order >= 0),
  is_visible boolean not null default true,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. Messages, Analytics, Activity Log
-- ------------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  purpose text not null default '',
  company text not null default '',
  linkedin_url text not null default '',
  github_url text not null default '',
  message text not null,
  is_read boolean not null default false,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'event',
  event_type text not null default '',
  session_id text not null default '',
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  ref_id uuid,
  visitor_hash text not null default 'anonymous',
  path text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_type_created on public.analytics_events (type, created_at desc);

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

-- ------------------------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- ------------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.about enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.certificates enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.analytics_events enable row level security;
alter table public.page_views enable row level security;
alter table public.section_views enable row level security;
alter table public.activity_logs enable row level security;
alter table public.admin_notes enable row level security;

create policy "Public read about" on public.about for select using (true);
create policy "Public read settings" on public.site_settings for select using (true);
create policy "Public read projects" on public.projects for select using (is_visible = true);
create policy "Public read experience" on public.experience for select using (is_visible = true);
create policy "Public read certificates" on public.certificates for select using (is_visible = true);
create policy "Public read published blog" on public.blog_posts for select using (status = 'published');
create policy "Public read approved testimonials" on public.testimonials for select using (status = 'approved' and is_visible = true);

create policy "Public submit contact" on public.contact_messages for insert with check (true);
create policy "Public submit testimonial" on public.testimonials for insert with check (status = 'pending');
create policy "Public log analytics" on public.analytics_events for insert with check (true);
create policy "Public log page_views" on public.page_views for insert with check (true);
create policy "Public log section_views" on public.section_views for insert with check (true);

create policy "Admin all admin_users" on public.admin_users for all using (public.is_admin());
create policy "Admin all about" on public.about for all using (public.is_admin());
create policy "Admin all settings" on public.site_settings for all using (public.is_admin());
create policy "Admin all projects" on public.projects for all using (public.is_admin());
create policy "Admin all experience" on public.experience for all using (public.is_admin());
create policy "Admin all certificates" on public.certificates for all using (public.is_admin());
create policy "Admin all blog" on public.blog_posts for all using (public.is_admin());
create policy "Admin all testimonials" on public.testimonials for all using (public.is_admin());
create policy "Admin all messages" on public.contact_messages for all using (public.is_admin());
create policy "Admin all analytics" on public.analytics_events for all using (public.is_admin());
create policy "Admin all page_views" on public.page_views for all using (public.is_admin());
create policy "Admin all section_views" on public.section_views for all using (public.is_admin());
create policy "Admin all activity_logs" on public.activity_logs for all using (public.is_admin());
create policy "Admin all admin_notes" on public.admin_notes for all using (public.is_admin());

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
-- 8. Schema & Table Grants
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;
