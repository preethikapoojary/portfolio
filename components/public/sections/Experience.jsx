'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import { getExperienceCoverMedia } from '@/utils/experience';
import { getCroppedImageStyle } from '@/utils/croppedImage';
import { formatDateRange } from '@/utils/date';
import ShareMenu from '@/components/public/common/ShareMenu';

function summarizeDescription(text) {
  if (!text) return '';
  if (!/<[a-z][\s\S]*>/i.test(text)) return text;
  const firstPara = text.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || text;
  const plain = firstPara.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > 280 ? `${plain.slice(0, 277).trimEnd()}…` : plain;
}

export default function Experience() {
  const { data: items, loading: expLoading } = useFetch(api.getExperience, []);

  if (expLoading || !items?.length) {
    return null;
  }

  const hasHomeOrder = items.some((e) => e.homeOrder !== null && e.homeOrder !== undefined);
  const homeItems = hasHomeOrder
    ? [...items]
        .filter((e) => e.homeOrder !== null && e.homeOrder !== undefined)
        .sort((a, b) => a.homeOrder - b.homeOrder)
        .slice(0, 6)
    : items;

  return (
    <section
      id="experience"
      className="flex flex-col justify-center border-t border-[#DCD9D1] bg-[#E9E5DC]/35 py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 border-b border-[#DCD9D1] pb-6 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
            My Experience
          </h2>
          <p className="mt-2.5 text-sm text-[#89877F] sm:text-base">
            Internships, hackathons, research, and key milestones.
          </p>
        </div>

        {/* Internships & Roles */}
        {homeItems?.length > 0 && (
          <div className="divide-y divide-[#DCD9D1]">
            {homeItems.map((exp, index) => {
              const coverMedia = getExperienceCoverMedia(exp);
              const coverUrl = coverMedia?.url || '';
              const detailHref = `/experience/${exp.slug || exp._id}`;
              const num = String(index + 1).padStart(2, '0');
              const imageFirst = index % 2 === 1;
              return (
              <article
                key={exp._id}
                className="grid items-center gap-8 py-12 first:pt-2 last:pb-2 lg:grid-cols-12 lg:gap-12"
              >
                <div className={`lg:col-span-6 ${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#89877F]">
                    {num}
                  </p>

                  <Link href={detailHref} className="group block">
                    <h3 className="font-display text-3xl font-medium tracking-tight text-[#22221F] transition-colors group-hover:text-[#85806D] sm:text-4xl">
                      {exp.role}
                    </h3>
                  </Link>

                  <div className="my-5 lg:hidden">
                    <Link
                      href={detailHref}
                      className="group block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40"
                    >
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={exp.role}
                          style={getCroppedImageStyle(coverMedia)}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E9E5DC] px-6 text-center">
                          <span className="font-display text-2xl text-[#85806D]">
                            {exp.role}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#89877F]">
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#22221F]">{exp.company}</p>
                      {exp.location && (
                        <p className="mt-0.5 text-xs text-[#89877F]">{exp.location}</p>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="mt-4 text-base leading-relaxed text-[#89877F] sm:text-lg">
                      {summarizeDescription(exp.description)}
                    </p>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
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
                    <Link href={detailHref} className="editorial-link text-[15px]">
                      View details <FiArrowRight size={15} />
                    </Link>
                    <ShareMenu
                      path={detailHref}
                      title={`${exp.role}${exp.company ? ` — ${exp.company}` : ''}`}
                    />
                  </div>
                </div>

                <div className={`hidden lg:block lg:col-span-6 ${imageFirst ? 'lg:order-1' : 'lg:order-2'}`}>
                  <Link
                    href={detailHref}
                    className="group block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40"
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={exp.role}
                        style={getCroppedImageStyle(coverMedia)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E9E5DC] px-6 text-center">
                        <span className="font-display text-3xl text-[#85806D]">
                          {exp.role}
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#89877F]">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </p>
                    <p className="mt-1.5 text-base font-medium text-[#22221F]">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="mt-0.5 text-sm text-[#89877F]">{exp.location}</p>
                    )}
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/experience" className="editorial-link text-base">
            Explore Experience <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
