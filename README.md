# Preethika Poojary — Personal Portfolio & CMS

A full-stack personal portfolio website built with Next.js 15 and Supabase, featuring an editorial public showcase and a built-in CMS-based Admin Dashboard for managing all portfolio content, media, and moderation workflows.

**Live Site:** [preethika-poojary.vercel.app](https://preethika-poojary.vercel.app/)

---

## Features

### Public Portfolio
- **Editorial Showcase:** Responsive Home page with configurable sections (About, Experience, Projects, Certificates, Testimonials, Contact).
- **Projects & Case Studies (`/projects`, `/projects/[slug]`):** Detailed project pages with cover images, screenshots, tech stacks, rich-text writeups, embedded diagrams, report PDFs, and repository/live links.
- **Experience & Milestones (`/experience`, `/experience/[slug]`):** Work history, hackathons, research presentations, supporting attachments, and proof documents with unique role-based URLs.
- **Certificates (`/certificates`, `/certificates/[slug]`):** Verified credentials with custom Home/page ordering, lightbox preview, unique shareable slugs, and one-click client-side PDF download.
- **Testimonials (`/testimonials`, `/testimonials-<slug>`):** Approved testimonials with individual shareable pages, 3-dot Copy/Download-as-PNG/Share menu, and a moderated public submission form.
- **Blog, Gallery & Contact:** Rich-text blog posts (`/blog/[slug]`), lightbox photo gallery, and contact form with email notifications.
- **SEO & Discovery:** Dynamic `sitemap.xml`, `robots.txt`, and `llms.txt` generation.

### CMS-Based Admin Dashboard (`/admin`)
- **Full Content Management:** Create, edit, reorder, and toggle visibility for Profile, Home Sections, Education, Skills, Coding Profiles, Projects, Experience, Achievements, Certificates, Blog Posts, Gallery, and Resume.
- **Unique Slug & Order Controls:** Auto-generated, editable unique slugs across Projects, Experience, Certificates, Blog, and Testimonials, plus non-negative sort orders (including dedicated Home page priority ordering for certificates).
- **Moderation & Inbox:** Review, approve, reject, or edit submitted testimonials, and manage incoming contact messages.
- **Rich Text & Media:** Integrated TipTap rich-text editor and cloud media/PDF uploads backed by Supabase Storage.
- **Safe Deletion & Insights:** Soft-delete Trash with restore/permanent delete, plus built-in Analytics charts, Activity Log, and Admin Notes.

---

## Tech Stack

- **Framework & Language:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & Motion:** Tailwind CSS, Framer Motion, React Icons, Lucide React
- **Backend, Database & Storage:** Next.js Route Handlers, Supabase (PostgreSQL with Row-Level Security, Auth, Storage)
- **Rich Text, Charts & Exports:** TipTap, Recharts, jsPDF, HTML5 Canvas (testimonial PNG export)
- **Verification & Email:** Cloudflare Turnstile, Google OAuth, Resend / Nodemailer, Zod
- **Deployment:** Vercel

---

## Project Structure

```text
app/            Next.js App Router pages and API route handlers
components/
  public/       Public layout, home sections, and sub-page views
  admin/        CMS dashboard pages and reusable form/table UI
lib/            Shared mappers, module configs, auth helpers, and CRUD handlers
supabase/       Database schema and SQL migrations
utils/          Client-side certificate PDF and testimonial PNG exporters
api/            Frontend API client wrappers
```

---

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   - Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) (and any applicable migrations in `supabase/`) in the Supabase SQL Editor.

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and provide your own Supabase, email, and verification keys. Never commit `.env.local` or secret keys.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   - Public site: `http://localhost:3000`
   - Admin CMS: `http://localhost:3000/admin`

### Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Create an optimized production build
- `npm run start` — Serve the production build
- `npm run lint` — Run ESLint checks
