'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import SectionHeading from '@/components/public/common/SectionHeading';
import { formatCalendarDate } from '@/utils/date';

export default function Achievements() {
  const { data: items, loading } = useFetch(api.getAchievements, []);
  if (loading || !items?.length) return null;

  return (
    <section
      id="achievements"
      className="flex flex-col justify-center border-t border-[#DCD9D1] py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeading
          number="04"
          eyebrow="Milestones"
          title="Achievements"
          actionLabel="View Experience & Honors"
          actionHref="/experience"
        />

        <div className="divide-y divide-[#DCD9D1]">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="grid gap-4 py-7 first:pt-2 last:pb-2 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <div className="flex items-baseline gap-4 md:col-span-3">
                <span className="text-xs font-medium tracking-[0.16em] text-[#85806D]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-[#89877F]">
                  {item.date ? formatCalendarDate(item.date) : 'Milestone'}
                </span>
              </div>

              <div className="md:col-span-9">
                <h3 className="font-display text-2xl font-medium text-[#22221F] sm:text-3xl">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-base leading-relaxed text-[#89877F]">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/experience" className="editorial-link text-[15px]">
            Explore full timeline <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
