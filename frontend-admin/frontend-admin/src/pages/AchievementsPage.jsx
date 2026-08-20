import CrudModulePage from '../components/ui/CrudModulePage';
import { achievementsApi } from '../api/endpoints';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'icon', label: 'Icon (react-icons name e.g. FiAward, or an image URL)', type: 'text' },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'date', label: 'Date', render: (row) => (row.date ? new Date(row.date).toLocaleDateString() : '—') },
];

export default function AchievementsPage() {
  return (
    <CrudModulePage
      title="Achievements"
      description="Milestones and recognitions shown on the public site."
      api={achievementsApi}
      columns={columns}
      fields={fields}
      emptyValues={{ title: '', description: '', icon: '' }}
    />
  );
}
