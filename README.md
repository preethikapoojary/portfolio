# Preethika — Personal Portfolio

Personal portfolio website with a built-in `/admin` CMS to manage projects, experience, education, skills, certificates, achievements, blog posts, and testimonials.

🔗 **Live Site:** [preethika-poojary.netlify.app](https://preethika-poojary.netlify.app/)

## Tech Stack

- **Frontend & API:** Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript
- **Database, Auth & Storage:** Supabase (PostgreSQL with RLS, Auth, Storage)
- **Hosting:** Vercel

## Quick Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
3. Copy `.env.example` to `.env.local` and fill in your Supabase keys and `ADMIN_EMAIL`.
4. Start the dev server:
   ```bash
   npm run dev
   ```
   - Public site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`
