-- Add admin verification flags for testimonial LinkedIn and GitHub URLs
alter table public.testimonials
  add column if not exists linkedin_verified boolean not null default false,
  add column if not exists github_verified boolean not null default false;
