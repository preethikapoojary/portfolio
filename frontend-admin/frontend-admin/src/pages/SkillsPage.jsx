import CrudModulePage from '../components/ui/CrudModulePage';
import { skillsApi } from '../api/endpoints';

const fields = [
  { key: 'name', label: 'Skill Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'proficiency', label: 'Proficiency (%)', type: 'number', min: 0, max: 100 },
  { key: 'icon', label: 'Icon (name or URL)', type: 'text' },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'proficiency', label: 'Proficiency', render: (row) => `${row.proficiency}%` },
];

export default function SkillsPage() {
  return (
    <CrudModulePage
      title="Skills"
      description="Technologies and tools shown with proficiency bars on the public site."
      api={skillsApi}
      columns={columns}
      fields={fields}
      emptyValues={{ name: '', category: 'General', proficiency: 80, icon: '' }}
    />
  );
}
