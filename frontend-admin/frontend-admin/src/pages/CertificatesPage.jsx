import CrudModulePage from '../components/ui/CrudModulePage';
import { certificatesApi } from '../api/endpoints';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'image', label: 'Certificate Image', type: 'image' },
  { key: 'credentialUrl', label: 'Credential URL', type: 'text' },
  { key: 'issueDate', label: 'Issue Date', type: 'date' },
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
      emptyValues={{ title: '', issuer: '', image: null, credentialUrl: '' }}
    />
  );
}
