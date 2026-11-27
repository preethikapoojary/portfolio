'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';

export default function About() {
  const { profile } = useSettings();
  const { data: education } = useFetch(api.getEducation, []);

  if (!profile) return null;

  const currentEdu = (education || [])[0];

  return (
    <section
      id="about"
      className="flex flex-col justify-center border-t border-[#DCD9D1] bg-[#E9E5DC]/35 py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 border-b border-[#DCD9D1] pb-6 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
            About
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-[#22221F] sm:text-xl sm:leading-relaxed">
              {profile.aboutMe}
            </p>

            <div className="mt-9">
              <Link href="/about" className="editorial-link text-base">
                Explore About <FiArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="border-t border-[#DCD9D1] pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Academic Highlight
            </p>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="font-display text-3xl font-medium text-[#22221F]">
                  {currentEdu?.institution || 'NMAM Institute of Technology, Nitte'}
                </h3>
                <p className="mt-1.5 text-base text-[#89877F]">
                  {currentEdu
                    ? [currentEdu.degree, currentEdu.fieldOfStudy].filter(Boolean).join(' — ')
                    : 'B.Tech — Information Science & Engineering'}
                </p>
              </div>

              <div className="flex items-baseline gap-8 border-t border-[#DCD9D1] pt-5">
                {currentEdu?.grade && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#89877F]">
                      Grade
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold text-[#22221F]">
                      {currentEdu.grade}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#89877F]">
                    Focus
                  </p>
                  <p className="mt-1 text-base font-medium text-[#22221F]">
                    Software Engineering &amp; AI/ML
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
