-- Remove unused company column from public.testimonials and ensure email column exists
alter table public.testimonials
  drop column if exists company,
  add column if not exists email text not null default '';
