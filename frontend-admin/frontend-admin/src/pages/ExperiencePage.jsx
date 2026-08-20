import CrudModulePage from '../components/ui/CrudModulePage';
import { experienceApi } from '../api/endpoints';

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
  { key: 'proofFile', label: 'Certificate / Proof Image (optional)', type: 'image' },
  { key: 'proofUrl', label: 'Certificate / Proof URL (optional, alternative to upload)', type: 'text' },
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
      }}
    />
  );
}
