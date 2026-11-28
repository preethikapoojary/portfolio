'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';

function formatRange(start, end, isCurrent) {
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  const s = fmt(start);
  const e = isCurrent ? 'Present' : fmt(end);
  return [s, e].filter(Boolean).join(' – ');
}

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
            {homeItems.map((exp) => (
              <article
                key={exp._id}
                className="grid gap-6 py-8 first:pt-2 last:pb-6 md:grid-cols-12 md:gap-10"
              >
                <div className="md:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#89877F]">
                    {formatRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </p>
                  <p className="mt-2 text-base font-medium text-[#22221F]">
                    {exp.company}
                  </p>
                  {exp.location && (
                    <p className="mt-0.5 text-sm text-[#89877F]">{exp.location}</p>
                  )}
                  {exp.coverImage?.url && (
                    <Link
                      href={`/experience/${exp.slug || exp._id}`}
                      className="group mt-4 hidden overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 md:block"
                    >
                      <img
                        src={exp.coverImage.url}
                        alt={exp.role}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>
                  )}
                </div>

                <div className="md:col-span-8">
                  <h3 className="font-display text-3xl font-medium text-[#22221F]">
                    {exp.role}
                  </h3>

                  {exp.coverImage?.url && (
                    <Link
                      href={`/experience/${exp.slug || exp._id}`}
                      className="group my-4 block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 md:hidden"
                    >
                      <img
                        src={exp.coverImage.url}
                        alt={exp.role}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>
                  )}

                  {exp.description && (
                    <p className="mt-4 text-base leading-relaxed text-[#22221F]/85 sm:text-lg">
                      {summarizeDescription(exp.description)}
                    </p>
                  )}

                  {exp.responsibilities?.length > 0 && (
                    <ul className="mt-5 space-y-2.5 border-l border-[#DCD9D1] pl-5 text-base text-[#89877F]">
                      {exp.responsibilities.slice(0, 3).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6">
                    <Link href={`/experience/${exp.slug || exp._id}`} className="editorial-link text-[15px]">
                      View details <FiArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
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
