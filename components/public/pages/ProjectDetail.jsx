'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiFileText, FiGithub } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import Lightbox from '@/components/public/common/Lightbox';
import ShareMenu from '@/components/public/common/ShareMenu';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading } = useFetch(() => api.getProjectBySlug(slug), [slug]);
  const [previewImg, setPreviewImg] = useState(null);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <p className="text-sm text-[#89877F]">Loading project…</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <p className="font-display text-2xl text-[#22221F]">Project not found</p>
        <Link href="/projects" className="editorial-link mt-4">
          <FiArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
      <header className="border-b border-[#DCD9D1] pb-8">
        {project.category && (
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            {project.category}
          </p>
        )}

        <h1 className="font-display text-4xl font-medium leading-[1.12] tracking-tight text-[#22221F] sm:text-5xl">
          {project.title}
        </h1>

        {project.coverImage?.url && (
          <div className="my-6 border border-[#DCD9D1] bg-[#E9E5DC]/40 p-2 md:hidden">
            <img
              src={project.coverImage.url}
              alt={project.title}
              className="w-full cursor-pointer object-cover"
              onClick={() => setPreviewImg(project.coverImage.url)}
            />
          </div>
        )}

        {project.shortDescription && (
          <p className="mt-4 text-base leading-relaxed text-[#89877F] sm:text-lg">
            {project.shortDescription}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="editorial-link"
              >
                <FiGithub size={14} /> GitHub Repository
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="editorial-link"
              >
                <FiExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.reportPdf?.url && (
              <a
                href={project.reportPdf.url}
                target="_blank"
                rel="noreferrer"
                className="editorial-link"
              >
                <FiFileText size={14} /> Project Report (PDF)
              </a>
            )}
          </div>

          <ShareMenu title={project.title} />
        </div>
      </header>

      {project.coverImage?.url && (
        <div className="my-10 hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 p-2 md:block">
          <img
            src={project.coverImage.url}
            alt={project.title}
            className="w-full cursor-pointer object-cover"
            onClick={() => setPreviewImg(project.coverImage.url)}
          />
        </div>
      )}

      {project.technologies?.length > 0 && (
        <div className="mb-10 border-b border-[#DCD9D1] pb-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Technologies Used
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="border border-[#DCD9D1] bg-[#E9E5DC]/45 px-3 py-1 text-xs font-medium text-[#22221F]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.longDescription && (
        <div
          className="editorial-prose text-base"
          dangerouslySetInnerHTML={{ __html: project.longDescription }}
        />
      )}

      {project.screenshots?.length > 0 && (
        <section className="mt-12 border-t border-[#DCD9D1] pt-10">
          <div className="grid gap-6 sm:grid-cols-2">
            {project.screenshots.map((shot, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPreviewImg(shot.url)}
                className="overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 p-2 text-left"
              >
                <img
                  src={shot.url}
                  alt={shot.alt || `${project.title} ${idx + 1}`}
                  className="w-full object-contain"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      <Lightbox
        image={previewImg}
        title={project.title}
        onClose={() => setPreviewImg(null)}
      />
    </article>
  );
}
