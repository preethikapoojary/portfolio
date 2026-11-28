'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';
import ShareMenu from '@/components/public/common/ShareMenu';
import { getExperienceCoverMedia } from '@/utils/experience';
import { getCroppedImageStyle } from '@/utils/croppedImage';
import { formatCalendarDate, formatDateRange } from '@/utils/date';

function summarizeDescription(text) {
  if (!text) return '';
  if (!/<[a-z][\s\S]*>/i.test(text)) return text;
  const firstPara = text.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || text;
  const plain = firstPara.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > 280 ? `${plain.slice(0, 277).trimEnd()}…` : plain;
}

export default function ExperiencePage() {
  const { data: experience, loading: expLoading } = useFetch(api.getExperience, []);
  const { data: achievements, loading: achLoading } = useFetch(api.getAchievements, []);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Experience & Recognition"
        title="My Experience"
        description="Internships, hackathons, research presentations, and academic accomplishments."
      />

      {/* Internships / Work Experience */}
      <section className="border-b border-[#DCD9D1] py-14">
        <div className="mb-10 border-b border-[#DCD9D1] pb-5 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-[#22221F] sm:text-4xl">
            Internships &amp; Roles
          </h2>
        </div>

        {expLoading ? (
          <p className="text-sm text-[#89877F]">Loading experience…</p>
        ) : !experience?.length ? (
          <p className="text-sm text-[#89877F]">No experience entries yet.</p>
        ) : (
          <div className="divide-y divide-[#DCD9D1]">
            {experience.map((exp) => {
              const coverMedia = getExperienceCoverMedia(exp);
              const coverUrl = coverMedia?.url || '';
              return (
              <article
                key={exp._id}
                className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#89877F]">
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-[#22221F]">{exp.company}</p>
                  {exp.location && (
                    <p className="mt-0.5 text-xs text-[#89877F]">{exp.location}</p>
                  )}
                  {coverUrl && (
                    <Link
                      href={`/experience/${exp.slug || exp._id}`}
                      className="group mt-4 hidden overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 md:block"
                    >
                      <img
                        src={coverUrl}
                        alt={exp.role}
                        style={getCroppedImageStyle(coverMedia)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>
                  )}
                </div>

                <div className="md:col-span-8">
                  <h2 className="font-display text-2xl font-medium text-[#22221F] sm:text-3xl">
                    {exp.role}
                  </h2>

                  {coverUrl && (
                    <Link
                      href={`/experience/${exp.slug || exp._id}`}
                      className="group my-4 block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 md:hidden"
                    >
                      <img
                        src={coverUrl}
                        alt={exp.role}
                        style={getCroppedImageStyle(coverMedia)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>
                  )}

                  {exp.description && (
                    <p className="mt-3 text-sm leading-relaxed text-[#22221F]/85 sm:text-base">
                      {summarizeDescription(exp.description)}
                    </p>
                  )}

                  {exp.responsibilities?.length > 0 && (
                    <ul className="mt-4 space-y-2 border-l border-[#DCD9D1] pl-4 text-sm text-[#89877F]">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="border border-[#DCD9D1] bg-[#E9E5DC]/45 px-2.5 py-1 text-[11px] font-medium text-[#22221F]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <Link href={`/experience/${exp.slug || exp._id}`} className="editorial-link">
                      View role details &amp; artifacts <FiArrowRight size={14} />
                    </Link>
                    <ShareMenu
                      path={`/experience/${exp.slug || exp._id}`}
                      title={`${exp.role}${exp.company ? ` — ${exp.company}` : ''}`}
                    />
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Achievements & Hackathons */}
      <section className="py-14">
        <div className="mb-10 border-b border-[#DCD9D1] pb-5 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-[#22221F] sm:text-4xl">
            Honors, Hackathons &amp; Research
          </h2>
        </div>

        {achLoading ? (
          <p className="text-sm text-[#89877F]">Loading achievements…</p>
        ) : !achievements?.length ? (
          <p className="text-sm text-[#89877F]">No achievements listed yet.</p>
        ) : (
          <div className="divide-y divide-[#DCD9D1]">
            {achievements.map((item, idx) => (
              <div
                key={item._id}
                className="grid gap-3 py-7 first:pt-0 last:pb-0 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <div className="flex items-baseline gap-4 md:col-span-3">
                  <span className="text-[11px] font-medium tracking-[0.16em] text-[#85806D]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#89877F]">
                    {item.date ? formatCalendarDate(item.date) : ''}
                  </span>
                </div>

                <div className="md:col-span-9">
                  <h3 className="font-display text-2xl font-medium text-[#22221F]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-[#89877F] sm:text-base">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
