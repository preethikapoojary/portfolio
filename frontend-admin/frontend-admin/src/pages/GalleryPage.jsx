import CrudModulePage from '../components/ui/CrudModulePage';
import { galleryApi } from '../api/endpoints';

const fields = [
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'caption', label: 'Caption', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
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
  { key: 'caption', label: 'Caption' },
  { key: 'category', label: 'Category' },
];

export default function GalleryPage() {
  return (
    <CrudModulePage
      title="Gallery"
      description="Photos and snapshots shown in the public site's gallery section."
      api={galleryApi}
      columns={columns}
      fields={fields}
      emptyValues={{ image: null, caption: '', category: 'General' }}
    />
  );
}
