'use client';
import CrudModulePage from '@/components/admin/ui/CrudModulePage';
import { blogApi } from '@/lib/adminApi/endpoints';
import { formatCalendarDate } from '@/utils/date';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'slug', label: 'Slug (optional — auto-generated from title)', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
  { key: 'content', label: 'Content', type: 'richtext' },
  { key: 'coverImage', label: 'Cover Image', type: 'image' },
  { key: 'tags', label: 'Tags', type: 'tags' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published'] },
  { key: 'order', label: 'Sort Order (Blog Page)', type: 'number', min: 1 },
  { key: 'homeOrder', label: 'Home Page Order (1, 2, 3… leave empty to hide from Home priority)', type: 'number', min: 1 },
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
    render: (row) => (row.publishedAt ? formatCalendarDate(row.publishedAt) : '—'),
  },
  { key: 'order', label: 'Order', render: (row) => row.order ?? 0 },
  {
    key: 'homeOrder',
    label: 'Home',
    render: (row) => (row.homeOrder !== null && row.homeOrder !== undefined ? `#${row.homeOrder}` : '—'),
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
      wideForm
      emptyValues={{
        title: '',
        slug: '',
        category: 'General',
        excerpt: '',
        content: '',
        coverImage: null,
        tags: [],
        status: 'draft',
        order: 1,
        homeOrder: '',
      }}
    />
  );
}
