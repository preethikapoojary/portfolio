'use client';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import { experienceApi } from '@/lib/adminApi/endpoints';

/* ---------- Related Projects inline editor ---------- */
const emptyProject = { name: '', description: '', githubUrl: '', liveDemoUrl: '' };

function RelatedProjectsEditor(value, onChange) {
  const projects = value || [];

  const update = (idx, key, val) => {
    const next = projects.map((p, i) => (i === idx ? { ...p, [key]: val } : p));
    onChange(next);
  };

  const add = () => onChange([...projects, { ...emptyProject }]);

  const remove = (idx) => onChange(projects.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {projects.map((proj, i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted">Project {i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-300 transition"
              title="Remove project"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
          <input
            className="input"
            placeholder="Project name"
            value={proj.name || ''}
            onChange={(e) => update(i, 'name', e.target.value)}
          />
          <textarea
            className="input"
            rows={2}
            placeholder="Short description (optional)"
            value={proj.description || ''}
            onChange={(e) => update(i, 'description', e.target.value)}
          />
          <input
            className="input"
            placeholder="GitHub URL (optional)"
            value={proj.githubUrl || ''}
            onChange={(e) => update(i, 'githubUrl', e.target.value)}
          />
          <input
            className="input"
            placeholder="Live demo URL (optional)"
            value={proj.liveDemoUrl || ''}
            onChange={(e) => update(i, 'liveDemoUrl', e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        <FiPlus size={14} /> Add Project
      </button>
    </div>
  );
}

/* ---------- Field configuration ---------- */
const fields = [
  { key: 'role', label: 'Role / Job Title', type: 'text' },
  { key: 'company', label: 'Company / Organization', type: 'text' },
  { key: 'location', label: 'Location (optional)', type: 'text' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'isCurrent', label: 'I currently work here (shows "Present")', type: 'checkbox' },
  { key: 'description', label: 'Short Professional Overview', type: 'textarea', rows: 2 },
  {
    key: 'responsibilities',
    label: 'What I Worked On (one per line)',
    type: 'lines',
    placeholder: 'Built the payments dashboard\nLed a team of 3 engineers\n...',
  },
  { key: 'technologies', label: 'Technologies / Skills', type: 'tags' },

  // ---- Legacy proof fields ----
  { key: 'proofFile', label: 'Certificate / Proof Image (optional)', type: 'image' },
  { key: 'proofUrl', label: 'Certificate / Proof URL (optional, alternative to upload)', type: 'text' },

  // ---- New detail-page fields ----
  {
    key: 'githubUrls',
    label: 'GitHub Repository URLs (one per line)',
    type: 'lines',
    placeholder: 'https://github.com/user/repo-1\nhttps://github.com/user/repo-2',
    rows: 3,
  },
  { key: 'projectReportUrl', label: 'Project Report URL (optional)', type: 'text' },
  { key: 'projectReportPdf', label: 'Project Report PDF (optional)', type: 'pdf' },
  { key: 'certificate', label: 'Certificate Image (optional)', type: 'image' },
  { key: 'attachments', label: 'Supporting Images / Documents', type: 'images' },
  {
    key: 'relatedProjects',
    label: 'Related Projects',
    type: 'custom',
    render: RelatedProjectsEditor,
  },
];

const columns = [
  { key: 'role', label: 'Role' },
  { key: 'company', label: 'Company' },
  {
    key: 'dates',
    label: 'Dates',
    render: (row) =>
      `${row.startDate ? new Date(row.startDate).getFullYear() : ''} — ${
        row.isCurrent ? 'Present' : row.endDate ? new Date(row.endDate).getFullYear() : ''
      }`,
  },
];

export default function ExperiencePage() {
  return (
    <CrudModulePage
      title="Experience"
      description="Work history shown as detailed professional entries on the public site."
      api={experienceApi}
      columns={columns}
      fields={fields}
      wideForm
      emptyValues={{
        role: '',
        company: '',
        location: '',
        isCurrent: false,
        description: '',
        responsibilities: [],
        technologies: [],
        proofFile: null,
        proofUrl: '',
        githubUrls: [],
        projectReportUrl: '',
        projectReportPdf: null,
        certificate: null,
        attachments: [],
        relatedProjects: [],
      }}
    />
  );
}
