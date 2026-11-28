'use client';

import Link from 'next/link';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';
import { getCroppedImageStyle } from '@/utils/croppedImage';

function formatYearRange(start, end) {
  const y = (d) => (d ? new Date(d).getFullYear() : '');
  const s = y(start);
  const e = y(end);
  if (!s && !e) return '';
  return [s, e || 'Present'].filter(Boolean).join(' – ');
}

export default function AboutPage() {
  const { profile } = useSettings();
  const { data: education } = useFetch(api.getEducation, []);
  const { data: skills } = useFetch(api.getSkills, []);
  const { data: codingProfiles } = useFetch(api.getCodingProfiles, []);

  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="About"
        title="Background, Academics & Technical Craft"
        description={profile?.title || 'Information Science & Engineering student and aspiring Software Developer.'}
      />

      {/* Editorial Profile Composition */}
      <section className="grid gap-12 border-b border-[#DCD9D1] py-14 lg:grid-cols-12 lg:gap-16">
        {profile?.profilePhoto?.url && (
          <div className="lg:col-span-4">
            <div className="border border-[#DCD9D1] bg-[#E9E5DC]/40 p-2.5">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={profile.profilePhoto.url}
                  alt={profile.name || 'Preethika Poojary'}
                  style={getCroppedImageStyle(profile.profilePhoto)}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        )}

        <div className={profile?.profilePhoto?.url ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Biography
          </p>
          <p className="whitespace-pre-line text-base leading-relaxed text-[#22221F] sm:text-lg sm:leading-relaxed">
            {profile?.aboutMe}
          </p>

          {profile?.careerObjective && (
            <div className="mt-8 border-l border-[#85806D] pl-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
                Aspirations
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#22221F]/85 sm:text-base">
                {profile.careerObjective}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href={api.downloadResumeUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#22221F] bg-[#22221F] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D]"
            >
              <FiDownload size={14} /> Download Resume
            </a>
            <Link href="/projects" className="editorial-link">
              Explore Projects <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Education */}
      {education?.length > 0 && (
        <section className="border-b border-[#DCD9D1] py-14">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Education
          </p>

          <div className="divide-y divide-[#DCD9D1]">
            {education.map((edu) => (
              <div
                key={edu._id}
                className="grid gap-3 py-6 first:pt-0 last:pb-0 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <div className="md:col-span-3">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#89877F]">
                    {formatYearRange(edu.startDate, edu.endDate)}
                  </p>
                  {edu.grade && (
                    <p className="mt-1 font-display text-lg font-semibold text-[#22221F]">
                      {edu.grade}
                    </p>
                  )}
                </div>

                <div className="md:col-span-9">
                  <h2 className="font-display text-2xl font-medium text-[#22221F]">
                    {edu.institution}
                  </h2>
                  <p className="mt-1 text-sm text-[#89877F]">
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' — ')}
                  </p>
                  {edu.description && (
                    <p className="mt-2.5 text-sm leading-relaxed text-[#22221F]/80">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {Object.keys(groupedSkills).length > 0 && (
        <section className="border-b border-[#DCD9D1] py-14">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Technical Skills
          </p>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div key={category} className="border-t border-[#DCD9D1] pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#22221F]">
                  {category}
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {items.map((skill) => {
                    const pct = Math.min(100, Math.max(0, Number(skill.proficiency) || 0));
                    return (
                      <li key={skill._id}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[#22221F]">{skill.name}</span>
                          {pct > 0 && (
                            <span className="text-xs text-[#89877F]">{pct}%</span>
                          )}
                        </div>
                        {pct > 0 && (
                          <div className="mt-1.5 h-[2px] w-full bg-[#DCD9D1]">
                            <div
                              className="h-full bg-[#85806D] transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Coding Profiles */}
      {codingProfiles?.length > 0 && (
        <section className="py-14">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Coding Profiles
          </p>
          <div className="flex flex-wrap gap-6">
            {codingProfiles.map((cp) => (
              <a
                key={cp._id}
                href={cp.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="editorial-link"
              >
                {cp.platform} {cp.username ? `(@${cp.username})` : ''} <FiArrowRight size={13} />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
