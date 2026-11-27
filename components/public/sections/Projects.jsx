'use client';

import Link from 'next/link';
import { FiArrowRight, FiGithub } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';

export default function Projects() {
  const { data: projects, loading } = useFetch(() => api.getProjects(), []);
  if (loading || !projects?.length) return null;

  const featured = projects.slice(0, 3);

  return (
    <section
      id="projects"
      className="flex flex-col justify-center border-t border-[#DCD9D1] py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 border-b border-[#DCD9D1] pb-6 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
            My Projects
          </h2>
          <p className="mt-2.5 text-sm text-[#89877F] sm:text-base">
            Selected machine learning, database, and software engineering work.
          </p>
        </div>

        <div className="divide-y divide-[#DCD9D1]">
          {featured.map((project, index) => {
            const num = String(index + 1).padStart(2, '0');
            const imageFirst = index % 2 === 1;

            return (
              <article
                key={project._id}
                className="grid items-center gap-8 py-12 first:pt-2 last:pb-2 lg:grid-cols-12 lg:gap-12"
              >
                <div
                  className={`lg:col-span-6 ${
                    imageFirst ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-[#89877F]">
                    <span>{num}</span>
                    {project.category && (
                      <>
                        <span>/</span>
                        <span>{project.category}</span>
                      </>
                    )}
                  </div>

                  <Link href={`/projects/${project.slug}`} className="group block">
                    <h3 className="font-display text-3xl font-medium tracking-tight text-[#22221F] transition-colors group-hover:text-[#85806D] sm:text-4xl">
                      {project.title}
                    </h3>
                  </Link>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="group my-5 block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 lg:hidden"
                  >
                    {project.coverImage?.url ? (
                      <img
                        src={project.coverImage.url}
                        alt={project.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E9E5DC] px-6 text-center">
                        <span className="font-display text-3xl text-[#85806D]">
                          {project.title}
                        </span>
                      </div>
                    )}
                  </Link>

                  {project.shortDescription && (
                    <p className="mt-4 text-base leading-relaxed text-[#89877F] sm:text-lg">
                      {project.shortDescription}
                    </p>
                  )}

                  {project.technologies?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="border border-[#DCD9D1] bg-[#E9E5DC]/45 px-3 py-1 text-xs font-medium text-[#22221F]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-5">
                      <Link href={`/projects/${project.slug}`} className="editorial-link text-[15px]">
                        View Project <FiArrowRight size={15} />
                      </Link>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="editorial-link text-[15px]"
                        >
                          <FiGithub size={14} /> GitHub Repository
                        </a>
                      )}
                    </div>
                    <ShareMenu path={`/projects/${project.slug}`} title={project.title} />
                  </div>
                </div>

                <div
                  className={`hidden lg:block lg:col-span-6 ${
                    imageFirst ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
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
                      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E9E5DC] px-6 text-center">
                        <span className="font-display text-3xl text-[#85806D]">
                          {project.title}
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/projects" className="editorial-link text-base">
            View All Projects <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
