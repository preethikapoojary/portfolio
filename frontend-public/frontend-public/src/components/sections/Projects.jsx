import { Link } from 'react-router-dom';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Projects() {
  const { data, loading } = useFetch(() => api.getProjects(), []);
  const projects = data?.items || data || [];

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        subtitle="A mix of things I've built, shipped, and broken along the way."
      />
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card h-64 animate-pulse" />
          ))}
        </div>
      ) : !projects.length ? (
        <EmptyState message="Projects will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <TiltCard
              key={project._id || project.slug}
              delay={i * 0.05}
              className="glass-card group overflow-hidden transition-shadow hover:shadow-glow"
            >
              {(project.coverImage?.url || project.screenshots?.[0]?.url) && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.coverImage?.url || project.screenshots[0].url}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-2 flex flex-wrap gap-2">
                  {(project.technologies || []).slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-xl font-semibold">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.shortDescription}</p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <Link to={`/projects/${project.slug}`} className="text-primary hover:underline">
                    View details
                  </Link>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="transition hover:scale-110 hover:text-primary">
                      <FiGithub />
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" aria-label="Live demo" className="transition hover:scale-110 hover:text-primary">
                      <FiExternalLink />
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </section>
  );
}
