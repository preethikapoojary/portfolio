# Portfolio — Public Site

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev            # http://localhost:5173
```

## What's live vs. forward-compatible

- **Live today:** Hero, About, Contact, and the Navbar/Footer/theme system —
  all backed by the Phase 1 backend (`/profile`, `/settings`, `/sections`, `/contact`).
- **Forward-compatible:** Skills, Projects, Experience, Certificates, Achievements,
  Gallery, Blog, Testimonials, Resume, GitHub, Coding Profiles — each calls the
  Phase 2 endpoint the backend architecture already defines. Until those routes
  ship, each section shows a clean empty state instead of breaking; once the
  routes exist, real data appears automatically with no frontend changes.

## Theming

Colors and font come from `SiteSettings.theme` in the database and are
injected as CSS custom properties (`--color-primary`, etc.) at runtime by
`SettingsContext` — see `src/index.css` for how the glass-card/gradient
treatment consumes them. Changing a color in the admin dashboard reskins the
whole site with no rebuild.

## Adding a Phase 2 section to the layout

Sections render in `src/pages/Home.jsx` via the `SECTION_COMPONENTS` map,
keyed by the `Section.key` values from the backend. A brand-new future
section just needs: a new key added to the backend's `Section` model, a new
component in `src/components/sections/`, and one line added to that map.
