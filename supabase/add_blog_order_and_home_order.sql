-- Add sort order and home page order columns to public.blog_posts
alter table public.blog_posts
  add column if not exists "order" integer not null default 0 check ("order" >= 0),
  add column if not exists home_order integer check (home_order is null or home_order >= 0);
