'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';

function formatRange(start, end, isCurrent) {
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  const s = fmt(start);
  const e = isCurrent ? 'Present' : fmt(end);
  return [s, e].filter(Boolean).join(' – ');
}

export default function ExperiencePage() {
  const { data: experience, loading: expLoading } = useFetch(api.getExperience, []);
  const { data: achievements, loading: achLoading } = useFetch(api.getAchievements, []);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Experience & Recognition"
        title="Professional Journey & Milestones"
        description="Internships, hackathons, research presentations, and academic accomplishments."
      />

      {/* Internships / Work Experience */}
      <section className="border-b border-[#DCD9D1] py-14">
        <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
          Internships &amp; Roles
        </p>

        {expLoading ? (
          <p className="text-sm text-[#89877F]">Loading experience…</p>
        ) : !experience?.length ? (
          <p className="text-sm text-[#89877F]">No experience entries yet.</p>
        ) : (
          <div className="divide-y divide-[#DCD9D1]">
            {experience.map((exp) => (
              <article
                key={exp._id}
                className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#89877F]">
                    {formatRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-[#22221F]">{exp.company}</p>
                  {exp.location && (
                    <p className="mt-0.5 text-xs text-[#89877F]">{exp.location}</p>
                  )}
                </div>

                <div className="md:col-span-8">
                  <h2 className="font-display text-2xl font-medium text-[#22221F] sm:text-3xl">
                    {exp.role}
                  </h2>

                  {exp.description && (
                    <p className="mt-3 text-sm leading-relaxed text-[#22221F]/85 sm:text-base">
                      {exp.description}
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

                  <div className="mt-6">
                    <Link href={`/experience/${exp._id}`} className="editorial-link">
                      View role details &amp; artifacts <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Achievements & Hackathons */}
      <section className="py-14">
        <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
          Honors, Hackathons &amp; Research
        </p>

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
                    {item.date
                      ? new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
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
