<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=6366F1&center=true&vCenter=true&width=560&lines=Preethika+Poojary+%E2%80%94+Portfolio;Next.js+15+%2B+Supabase+CMS;Editorial+Public+Showcase;Built-in+Admin+Dashboard" alt="Typing SVG" />
</div>

<h1 align="center">Preethika Poojary — Personal Portfolio &amp; CMS</h1>

<p align="center">
  Full-stack personal portfolio website with an editorial public showcase and a built-in <b>CMS-based Admin Dashboard</b> to manage projects, experience, certificates, testimonials, blog posts, and media.
</p>

<p align="center">
  <a href="https://preethika-poojary.vercel.app/"><img src="https://img.shields.io/badge/Live_Site-preethika--poojary.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Site"></a>
  <a href="https://www.linkedin.com/in/preethikapoojary/"><img src="https://img.shields.io/badge/LinkedIn-Preethika-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="mailto:preethikapreethika294@gmail.com"><img src="https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
</p>

---

### ✨ Key Highlights

| **Editorial Public Portfolio** | **CMS-Based Admin Dashboard (`/admin`)** |
| :--- | :--- |
| • **Home & Sub-Pages:** Configurable sections for About, Experience, Projects, Certificates, Testimonials, Gallery, Blog, and Contact. | • **Dynamic Content Modules:** Create, edit, reorder, and toggle visibility across Profile, Sections, Education, Skills, Coding Profiles, Projects, Experience, Achievements, Certificates, Blog, Gallery, and Resume. |
| • **Unique Shareable URLs:** Clean slug-based detail pages for Projects (`/projects/[slug]`), Experience (`/experience/[slug]`), Certificates (`/certificates/[slug]`), Blog (`/blog/[slug]`), and Testimonials (`/testimonials-<slug>`). | • **Slug & Order Controls:** Live unique slug previews with collision protection, plus non-negative sort ordering and Home priority ordering for certificates. |
| • **One-Click Exports:** Client-side **PDF download** for certificates and **PNG image card download** in the 3-dot menu for testimonials. | • **Moderation & Rich Media:** Testimonial approval workflow, TipTap rich-text editor, cloud media/PDF uploads, soft-delete Trash/Restore, Analytics, Activity Log, and Notes. |

---

### 🛠️ Tech Stack

<div align="center">

| **Layer** | **Technologies** |
| :--- | :--- |
| **Framework & UI** | ![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) |
| **Database & Storage** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) |
| **CMS, Charts & Exports** | ![TipTap](https://img.shields.io/badge/TipTap-0D0D0D?style=for-the-badge) ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge) ![jsPDF](https://img.shields.io/badge/jsPDF-EC1C24?style=for-the-badge) |
| **Verification & Hosting** | ![Cloudflare](https://img.shields.io/badge/Cloudflare_Turnstile-F38020?style=for-the-badge&logo=cloudflare&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |

</div>

---

### 📁 Project Structure

```text
app/            Next.js App Router pages and API route handlers
components/
  public/       Public layout, home sections, and sub-page views
  admin/        CMS dashboard pages and reusable form/table components
lib/            Shared mappers, module configs, auth helpers, and CRUD handlers
supabase/       PostgreSQL schema and SQL migrations
utils/          Client-side certificate PDF and testimonial PNG exporters
api/            Frontend API client wrappers
```

---

### 🚀 Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Set up Supabase**
   - Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) (and any applicable migrations in `supabase/`) in the SQL Editor.
3. **Configure environment variables**
   - Copy `.env.example` to `.env.local` and add your own keys. Never commit `.env.local` or secret credentials.
4. **Run the development server**
   ```bash
   npm run dev
   ```
   - Public site: `http://localhost:3000`
   - Admin CMS: `http://localhost:3000/admin`

| **Script** | **Description** |
| :--- | :--- |
| `npm run dev` | Start local development server |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint checks |

---

<p align="center">
  <i>Designed &amp; built for clean editorial presentation and effortless CMS management.</i>
</p>
