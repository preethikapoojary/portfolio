# Portfolio & Admin CMS

A unified personal portfolio and content management system built with **Next.js (App Router)** and **Supabase** (PostgreSQL, Auth, and Storage), featuring a public portfolio site and a protected `/admin` dashboard in a single codebase.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript + React 19)
- **Styling**: Tailwind CSS
- **Database, Auth & Storage**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Supabase Storage)
- **Rich Text & Charts**: Tiptap, Recharts
- **Bot Protection (Optional)**: Cloudflare Turnstile
- **Hosting**: Netlify (`netlify.toml` included)

## Project Structure

```text
├── app/
│   ├── page.tsx                  # Public Home page
│   ├── projects/, blog/, ...     # Dedicated public pages
│   ├── admin/                    # Protected /admin CMS dashboard
│   └── api/                      # Public & admin Next.js Route Handlers
├── components/
│   ├── public/                   # Public UI sections, layout & pages
│   └── admin/                    # Admin dashboard UI & CRUD modules
├── context/                      # Theme, Settings & AdminAuth contexts
├── lib/                          # Supabase clients, auth guards, mappers & CRUD handler
├── supabase/
│   └── schema.sql                # Full Postgres schema, RLS policies & storage bucket
├── scripts/
│   ├── import-live.mjs           # Import data from an existing portfolio API
│   └── seed.mjs                  # Seed starter portfolio data
├── .env.example                  # Required environment variables template
└── netlify.toml                  # Netlify build & secrets-scan configuration
```

## Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a project in [Supabase](https://supabase.com).
   - Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**.
   - In **Authentication → Users**, create an admin user with email and password.

3. **Configure environment variables**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase `anon` / publishable key
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase `service_role` / secret key (server-only)
   - `NEXT_PUBLIC_SUPABASE_BUCKET` — `portfolio-media`
   - `ADMIN_EMAIL` & `NEXT_PUBLIC_ADMIN_EMAIL` — Admin email created in Supabase Auth
   - `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` (or your production URL)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   - Public site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`

## Deploying to Netlify

1. Push this repository to GitHub and import it in **Netlify**.
2. Build settings are preconfigured in `netlify.toml` (`npm run build`, publish `.next`).
3. Add all variables from `.env.example` under **Site configuration → Environment variables** (with `NEXT_PUBLIC_APP_URL` set to your Netlify URL).
4. In **Supabase → Authentication → URL Configuration**, set **Site URL** to your Netlify URL and add `https://<your-site>.netlify.app/**` to **Redirect URLs**.

## Scripts

- `npm run dev` — Start local development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `node scripts/seed.mjs` — Populate starter portfolio content
