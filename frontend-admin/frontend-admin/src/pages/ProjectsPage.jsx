import CrudModulePage from '../components/ui/CrudModulePage';
import { projectsApi } from '../api/endpoints';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'shortDescription', label: 'Short Description', type: 'textarea', rows: 2 },
  { key: 'longDescription', label: 'Full Description', type: 'richtext' },
  { key: 'coverImage', label: 'Cover Image (shown on the project card — separate from screenshots)', type: 'image' },
  { key: 'screenshots', label: 'Screenshots', type: 'images' },
  { key: 'technologies', label: 'Technologies', type: 'tags' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { key: 'liveDemoUrl', label: 'Live Demo URL', type: 'text' },
  { key: 'videoUrl', label: 'Video URL', type: 'text' },
  { key: 'reportPdf', label: 'Project Report PDF (optional)', type: 'pdf' },
  { key: 'isFeatured', label: 'Featured project', type: 'checkbox' },
];

const columns = [
  {
    key: 'thumb',
    label: '',
    render: (row) =>
      row.coverImage?.url || row.screenshots?.[0]?.url ? (
        <img src={row.coverImage?.url || row.screenshots[0].url} alt="" className="h-10 w-14 rounded object-cover" />
      ) : (
        <div className="h-10 w-14 rounded bg-slate-100" />
      ),
  },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'isFeatured', label: 'Featured', render: (row) => (row.isFeatured ? '★' : '') },
];

export default function ProjectsPage() {
  return (
    <CrudModulePage
      title="Projects"
      description="Your portfolio projects — cover image, screenshots, links, tech stack, full case-study content, and an optional report."
      api={projectsApi}
      columns={columns}
      fields={fields}
      wideForm
      emptyValues={{
        title: '',
        category: 'General',
        shortDescription: '',
        longDescription: '',
        coverImage: null,
        screenshots: [],
        technologies: [],
        githubUrl: '',
        liveDemoUrl: '',
        videoUrl: '',
        reportPdf: null,
        isFeatured: false,
      }}
    />
  );
}
