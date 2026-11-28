-- Add cover_image column to public.experience for Internships & Roles cover images
alter table public.experience
  add column if not exists cover_image jsonb not null default '{"url": null, "publicId": null, "alt": ""}'::jsonb;
