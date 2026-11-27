'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';

export default function ProjectsPage() {
  const { data: projects, loading } = useFetch(() => api.getProjects(), []);
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    ...new Set((projects || []).map((p) => p.category || 'General')),
  ];
  const filtered =
    category === 'All'
      ? projects || []
      : (projects || []).filter((p) => (p.category || 'General') === category);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Selected Work"
        title="Projects & Case Studies"
        description="A collection of machine learning systems, database applications, and software engineering projects."
      />

      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 border-b border-[#DCD9D1] py-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === cat
                  ? 'border-[#22221F] bg-[#22221F] text-[#F6F4EF]'
                  : 'border-[#DCD9D1] bg-transparent text-[#89877F] hover:border-[#22221F] hover:text-[#22221F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-sm text-[#89877F]">Loading projects…</p>
      ) : (
        <div className="divide-y divide-[#DCD9D1]">
          {filtered.map((project, index) => (
            <article
              key={project._id}
              className="grid items-start gap-8 py-12 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40"
                >
                  {project.coverImage?.url ? (
                    <img
                      src={project.coverImage.url}
                      alt={project.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-[#E9E5DC] p-6 text-center">
                      <span className="font-display text-2xl text-[#85806D]">
                        {project.title}
                      </span>
                    </div>
                  )}
                </Link>
              </div>

              <div className="lg:col-span-7">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
                  {String(index + 1).padStart(2, '0')} — {project.category || 'Project'}
                </p>

                <Link href={`/projects/${project.slug}`} className="group block">
                  <h2 className="font-display text-3xl font-medium tracking-tight text-[#22221F] transition-colors group-hover:text-[#85806D]">
                    {project.title}
                  </h2>
                </Link>

                {project.shortDescription && (
                  <p className="mt-3 text-sm leading-relaxed text-[#22221F]/85 sm:text-base">
                    {project.shortDescription}
                  </p>
                )}

                {project.technologies?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="border border-[#DCD9D1] bg-[#E9E5DC]/45 px-2.5 py-1 text-[11px] font-medium text-[#22221F]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <Link href={`/projects/${project.slug}`} className="editorial-link">
                    Read Case Study <FiArrowRight size={14} />
                  </Link>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#89877F] hover:text-[#22221F]"
                    >
                      <FiGithub size={14} /> Repository
                    </a>
                  )}

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#89877F] hover:text-[#22221F]"
                    >
                      <FiExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
