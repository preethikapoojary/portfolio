'use client';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import { achievementsApi } from '@/lib/adminApi/endpoints';
import { formatCalendarDate } from '@/utils/date';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'order', label: 'Sort Order (Experience Page)', type: 'number', min: 1 },
  { key: 'homeOrder', label: 'Home Page Order (1, 2, 3… leave empty to hide from Home priority)', type: 'number', min: 1 },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'date', label: 'Date', render: (row) => (row.date ? formatCalendarDate(row.date) : '—') },
  { key: 'order', label: 'Order', render: (row) => row.order ?? 0 },
  {
    key: 'homeOrder',
    label: 'Home',
    render: (row) => (row.homeOrder !== null && row.homeOrder !== undefined ? `#${row.homeOrder}` : '—'),
  },
];

export default function AchievementsPage() {
  return (
    <CrudModulePage
      title="Achievements"
      description="Milestones and recognitions shown on the public site."
      api={achievementsApi}
      columns={columns}
      fields={fields}
      emptyValues={{ title: '', description: '', icon: 'FiAward', order: 1, homeOrder: '' }}
    />
  );
}
