# Portfolio — Admin Dashboard

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev            # http://localhost:5174
```

Log in with the admin account you seeded on the backend (see backend
README's `scripts/createAdmin.js`).

## What's live vs. Phase 2

- **Live today:** Dashboard overview (analytics + notification badges),
  Profile, Settings (theme/hero/footer), Sections (drag-reorder + visibility),
  Activity Log.
- **Phase 2:** Projects, Skills, Education, Experience, Certificates,
  Achievements, Gallery, Blog, Resume, Coding Profiles, Testimonials,
  Messages — all appear in the sidebar today with a "Soon" badge and route
  to a shared `ComingSoon` placeholder.

## Adding a Phase 2 module (the fast path)

This project already has the three reusable pieces every module needs:
`DataTable`, `ReorderableList`, `SearchBar`, plus `createCrudApi(basePath)`
in `src/api/endpoints.js` which mirrors the backend's CRUD factory.

For a new module (e.g. Skills), once its backend routes exist:

```js
// src/api/endpoints.js
export const skillsApi = createCrudApi('/admin/skills');
```

```jsx
// src/pages/SkillsPage.jsx — list page
const [rows, setRows] = useState([]);
useEffect(() => { skillsApi.list().then(res => setRows(res.data)); }, []);
<DataTable
  columns={[{ key: 'name', label: 'Name' }, { key: 'proficiency', label: 'Proficiency' }]}
  rows={rows}
  onEdit={...}
  onDelete={(row) => skillsApi.remove(row._id).then(reload)}
  onToggleVisibility={(row) => skillsApi.toggleVisibility(row._id).then(reload)}
/>
```

Then swap that module's entry in `src/config/moduleRegistry.js` from
`status: 'phase2'` to `status: 'live'` and point its route at the new page
instead of `ComingSoon` in `App.jsx`.

## Auth flow

`AuthContext` holds the in-memory access token; `axiosClient.js` attaches it
to every request and silently refreshes it via the httpOnly cookie on a 401,
retrying the original request once. If refresh also fails, it redirects to
`/login`. `ProtectedRoute` is a UX-level guard only — the real enforcement is
the backend's `verifyToken`/`requireAdmin` middleware.
