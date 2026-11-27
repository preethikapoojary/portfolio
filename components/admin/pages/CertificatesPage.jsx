'use client';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import { certificatesApi } from '@/lib/adminApi/endpoints';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'slug', label: 'Slug (optional — auto-generated from title)', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'image', label: 'Certificate Image', type: 'image' },
  { key: 'credentialUrl', label: 'Credential URL', type: 'text' },
  { key: 'issueDate', label: 'Issue Date', type: 'date' },
  { key: 'order', label: 'Sort Order (Certificates Page)', type: 'number', min: 0 },
  { key: 'homeOrder', label: 'Home Page Order (1, 2, 3… leave empty to hide from Home priority)', type: 'number', min: 0 },
];

const columns = [
  {
    key: 'thumb',
    label: '',
    render: (row) =>
      row.image?.url ? (
        <img src={row.image.url} alt="" className="h-10 w-10 rounded object-cover" />
      ) : (
        <div className="h-10 w-10 rounded bg-slate-100" />
      ),
  },
  { key: 'title', label: 'Title' },
  { key: 'issuer', label: 'Issuer' },
  { key: 'order', label: 'Order', render: (row) => row.order ?? 0 },
  {
    key: 'homeOrder',
    label: 'Home',
    render: (row) => (row.homeOrder !== null && row.homeOrder !== undefined ? `#${row.homeOrder}` : '—'),
  },
  {
    key: 'issueDate',
    label: 'Issued',
    render: (row) => (row.issueDate ? new Date(row.issueDate).getFullYear() : '—'),
  },
];

export default function CertificatesPage() {
  return (
    <CrudModulePage
      title="Certificates"
      description="Courses and credentials shown on the public site."
      api={certificatesApi}
      columns={columns}
      fields={fields}
      emptyValues={{
        title: '',
        slug: '',
        issuer: '',
        image: null,
        credentialUrl: '',
        order: 0,
        homeOrder: '',
      }}
    />
  );
}
