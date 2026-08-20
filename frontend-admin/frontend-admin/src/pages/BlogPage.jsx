import CrudModulePage from '../components/ui/CrudModulePage';
import { blogApi } from '../api/endpoints';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
  { key: 'content', label: 'Content', type: 'richtext' },
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'tags', label: 'Tags', type: 'tags' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published'] },
];

const columns = [
  {
    key: 'thumb',
    label: '',
    render: (row) =>
      row.coverImage?.url ? (
        <img src={row.coverImage.url} alt="" className="h-10 w-14 rounded object-cover" />
      ) : (
        <div className="h-10 w-14 rounded bg-slate-100" />
      ),
  },
  { key: 'title', label: 'Title' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          row.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-muted'
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: 'publishedAt',
    label: 'Published',
    render: (row) => (row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : '—'),
  },
];

export default function BlogPage() {
  return (
    <CrudModulePage
      title="Blog"
      description="Articles authored with the rich text editor. Toggle visibility to publish/unpublish."
      api={blogApi}
      columns={columns}
      fields={fields}
      hasOrder={false}
      wideForm
      emptyValues={{
        title: '',
        category: 'General',
        excerpt: '',
        content: '',
        coverImage: null,
        tags: [],
        status: 'draft',
      }}
    />
  );
}
