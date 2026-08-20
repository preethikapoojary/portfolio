# Portfolio Backend — Phase 1 Foundation

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in real values
npm run dev             # nodemon, http://localhost:5000
```

First boot auto-creates the `Profile` and `SiteSettings` singleton documents and
seeds the `Section` collection with all known public sections.

### Creating the first admin account

There's no public signup route (by design — this is a single/multi *admin*
system, not a public user system). Seed the first admin directly, e.g. with a
one-off script or the Mongo shell:

```js
// scripts/createAdmin.js (run once with `node scripts/createAdmin.js`)
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await Admin.hashPassword('ChangeThisPassword123!');
  await Admin.create({ name: 'Your Name', email: 'you@example.com', passwordHash });
  console.log('Admin created');
  process.exit(0);
})();
```

## What's implemented

- Env validation, DB connection, Cloudinary config
- **`crudFactory.js`** — the reusable CRUD router (list/search/pagination, get, create, update,
  delete, reorder, visibility toggle, automatic activity logging)
- JWT access + hashed/revocable refresh token auth (login/refresh/logout/me)
- `ActivityLog` (append-only audit trail), `SystemNotification`, `AnalyticsEvent` models + services
- `Profile`, `SiteSettings`, `Section` singleton/config modules, fully wired end to end
- Provider-agnostic email service (Nodemailer/Gmail today, swap via `EMAIL_PROVIDER` env var)
- Centralized error handling, rate limiting, security headers (helmet), scoped CORS
- **Content modules, all with public + admin routes, all storing to MongoDB:**
  - Education, Experience, Achievements, Coding Profiles, Skills, Certificates, Gallery — built directly
    on the CRUD factory
  - Projects — custom controller (slug generation, category/featured filters, view-count analytics
    on `GET /projects/:slug`)
  - Blog — custom controller (slug generation, draft/publish workflow with `publishedAt` stamping,
    text search across title/excerpt/content)
  - Resume — full version history (`ResumeVersion` model): upload, activate, delete (blocked while
    active), public download always serves the active version and logs a `resume_download` event
  - Image upload — `POST /admin/upload/image` (Multer memory storage → Cloudinary), used by every
    module with an image field (Certificates, Gallery, Project screenshots)

### Note on "categories"

Skills/Projects/Gallery store `category` as a free-text field rather than a separate `Category`
collection — simpler for this phase, still fully admin-editable, and can be upgraded to a shared
collection later without breaking the public API shape if you want cross-module category management.

## Adding a new content module (Phase 2 pattern)

Example — adding "Skills":

```js
// src/models/Skill.js
const mongoose = require('mongoose');
const skillSchema = new mongoose.Schema({
  name: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  proficiency: { type: Number, min: 0, max: 100 },
  icon: String,
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Skill', skillSchema);
```

```js
// src/routes/admin/skill.routes.js
const buildCrudRouter = require('../../utils/crudFactory');
const Skill = require('../../models/Skill');
module.exports = buildCrudRouter(Skill, {
  resourceName: 'Skill',
  searchableFields: ['name'],
  populate: 'categoryId',
});
```

```js
// src/routes/index.js — one line added under adminRouter
adminRouter.use('/skills', require('./admin/skill.routes'));
```

That's the entire backend piece for a new list-based module — CRUD, search, reorder,
visibility toggling, and activity logging all come for free from the factory.

## Folder structure

```
src/
├── config/       env, db, cloudinary
├── models/       Mongoose schemas
├── controllers/  thin request handlers (used where a module needs custom logic
│                 beyond generic CRUD, e.g. singletons, auth, dashboard)
├── services/     business logic (auth, email, analytics, activity log, notifications)
├── routes/
│   ├── public/   unauthenticated read routes
│   └── admin/    protected routes (JWT + admin role required)
├── middlewares/  auth, error handling, rate limiting, analytics tracking
├── utils/        ApiError, ApiResponse, asyncHandler, slugify, crudFactory
├── app.js        Express app + middleware wiring
└── server.js     boot: env validation → DB connect → seed → listen
```

## Still pending (not part of this phase)

Testimonials and Contact Messages already have their models (`Testimonial`, `ContactMessage`) from
earlier phases, but public submission routes (`POST /contact`, `POST /testimonials`) and their admin
moderation UI aren't built yet. GitHub integration (profile/pinned-repos/contributions caching) is
also still pending.
