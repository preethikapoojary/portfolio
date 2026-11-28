'use client';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import { educationApi } from '@/lib/adminApi/endpoints';

const fields = [
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'degree', label: 'Degree', type: 'text' },
  { key: 'fieldOfStudy', label: 'Field of Study', type: 'text' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'grade', label: 'Grade', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'order', label: 'Sort Order', type: 'number', min: 1 },
];

const columns = [
  { key: 'institution', label: 'Institution' },
  { key: 'degree', label: 'Degree' },
  {
    key: 'dates',
    label: 'Dates',
    render: (row) =>
      `${row.startDate ? new Date(row.startDate).getFullYear() : ''} — ${
        row.endDate ? new Date(row.endDate).getFullYear() : 'Present'
      }`,
  },
  { key: 'order', label: 'Order', render: (row) => row.order ?? 0 },
];

export default function EducationPage() {
  return (
    <CrudModulePage
      title="Education"
      description="Institutions, degrees, and academic history shown on the public site."
      api={educationApi}
      columns={columns}
      fields={fields}
      emptyValues={{ institution: '', degree: '', fieldOfStudy: '', description: '', order: 1 }}
    />
  );
}
