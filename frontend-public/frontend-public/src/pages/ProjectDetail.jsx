import { useParams, Link } from 'react-router-dom';
import { FiGithub, FiExternalLink, FiArrowLeft, FiPlayCircle, FiFileText, FiDownload } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import api from '../api/endpoints';
import LoadingScreen from '../components/layout/LoadingScreen';

function toEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null; // non-YouTube links fall back to a plain "Watch video" link
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useFetch(() => api.getProjectBySlug(slug), [slug]);

  if (loading) return <LoadingScreen />;

  if (error || !project) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-40 text-center">
        <h1 className="font-display text-2xl">Project not found</h1>
        <Link to="/#projects" className="mt-4 inline-block text-primary hover:underline">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link to="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <FiArrowLeft /> Back to projects
      </Link>

      {project.coverImage?.url && (
        <div className="glass-card mb-8 aspect-video overflow-hidden">
          <img src={project.coverImage.url} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}

      <h1 className="font-display text-4xl font-semibold">{project.title}</h1>
      {project.shortDescription && (
        <p className="mt-2 text-lg text-slate-400">{project.shortDescription}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {(project.technologies || []).map((t) => (
          <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-5 text-sm">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
            <FiGithub /> Source
          </a>
        )}
        {project.liveDemoUrl && (
          <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
            <FiExternalLink /> Live demo
          </a>
        )}
        {project.videoUrl && (
          <a href={project.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
            <FiPlayCircle /> Watch video
          </a>
        )}
      </div>

      {project.videoUrl && toEmbedUrl(project.videoUrl) && (
        <div className="glass-card mt-8 aspect-video overflow-hidden">
          <iframe
            src={toEmbedUrl(project.videoUrl)}
            title={`${project.title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}

      {project.reportPdf?.url && (
        <div className="glass-card mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <FiFileText className="text-2xl text-primary" />
            <div>
              <p className="font-medium">Project Report</p>
              <p className="text-xs text-slate-500">Detailed write-up / case study PDF</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={project.reportPdf.url}
              target="_blank"
              rel="noreferrer"
              className="glass-card flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              <FiFileText size={14} /> View Report
            </a>
            <a
              href={project.reportPdf.url}
              download
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-surface"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              <FiDownload size={14} /> Download Report
            </a>
          </div>
        </div>
      )}

      {project.screenshots?.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Screenshots</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((s) => (
              <img key={s.url} src={s.url} alt={s.alt || project.title} className="glass-card w-full object-cover transition hover:scale-[1.02]" />
            ))}
          </div>
        </div>
      )}

      <div
        className="prose prose-invert mt-10 max-w-none"
        // Content is authored via TipTap in the admin dashboard and stored
        // as sanitized HTML on the backend — safe to render directly here.
        dangerouslySetInnerHTML={{ __html: project.longDescription || '' }}
      />
    </article>
  );
}
