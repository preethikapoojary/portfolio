'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiFileText, FiGithub } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import Lightbox from '@/components/public/common/Lightbox';
import { getExperienceCoverUrl } from '@/utils/experience';
import { formatDateRange } from '@/utils/date';

export default function ExperienceDetail() {
  const { id } = useParams();
  const { data: exp, loading } = useFetch(() => api.getExperienceById(id), [id]);
  const [previewImg, setPreviewImg] = useState(null);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <p className="text-sm text-[#89877F]">Loading experience…</p>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <p className="font-display text-2xl text-[#22221F]">Experience entry not found</p>
        <Link href="/experience" className="editorial-link mt-4">
          <FiArrowLeft size={14} /> Back to Experience
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
      <header className="border-b border-[#DCD9D1] pb-8">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
          {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
          {exp.location ? ` · ${exp.location}` : ''}
        </p>

        <h1 className="font-display text-4xl font-medium leading-[1.12] tracking-tight text-[#22221F] sm:text-5xl">
          {exp.role}
        </h1>

        <p className="mt-2 text-lg text-[#85806D]">{exp.company}</p>
      </header>

      <div className="space-y-10 py-10">
        {getExperienceCoverUrl(exp) && (
          <button
            type="button"
            onClick={() => setPreviewImg(getExperienceCoverUrl(exp))}
            className="block w-full overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 text-left"
          >
            <img
              src={getExperienceCoverUrl(exp)}
              alt={exp.role}
              className="aspect-[16/9] w-full object-cover"
            />
          </button>
        )}

        {exp.description && (
          /<[a-z][\s\S]*>/i.test(exp.description) ? (
            <div
              className="editorial-prose text-base"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          ) : (
            <p className="text-base leading-relaxed text-[#22221F] sm:text-lg">
              {exp.description}
            </p>
          )
        )}

        {exp.responsibilities?.length > 0 && (
          <section className="border-t border-[#DCD9D1] pt-8">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Key Responsibilities
            </p>
            <ul className="space-y-2.5 border-l border-[#DCD9D1] pl-5 text-sm leading-relaxed text-[#22221F]/85 sm:text-base">
              {exp.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {exp.technologies?.length > 0 && (
          <section className="border-t border-[#DCD9D1] pt-8">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((t) => (
                <span
                  key={t}
                  className="border border-[#DCD9D1] bg-[#E9E5DC]/45 px-3 py-1 text-xs font-medium text-[#22221F]"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {(exp.certificate?.url || exp.proofFile?.url || exp.projectReportPdf?.url || exp.proofUrl) && (
          <section className="border-t border-[#DCD9D1] pt-8">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Documents &amp; Verification
            </p>
            <div className="flex flex-wrap gap-6">
              {exp.certificate?.url && (
                <button
                  type="button"
                  onClick={() => setPreviewImg(exp.certificate.url)}
                  className="editorial-link"
                >
                  View Certificate <FiExternalLink size={13} />
                </button>
              )}
              {exp.proofFile?.url && (
                <button
                  type="button"
                  onClick={() => setPreviewImg(exp.proofFile.url)}
                  className="editorial-link"
                >
                  View Proof <FiExternalLink size={13} />
                </button>
              )}
              {exp.projectReportPdf?.url && (
                <a
                  href={exp.projectReportPdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link"
                >
                  <FiFileText size={14} /> Project Report (PDF)
                </a>
              )}
              {exp.proofUrl && (
                <a
                  href={exp.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link"
                >
                  External Link <FiExternalLink size={13} />
                </a>
              )}
            </div>
          </section>
        )}

        {exp.attachments?.some((a) => a?.url) && (
          <section className="border-t border-[#DCD9D1] pt-8">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Supporting Images
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {exp.attachments
                .filter((a) => a?.url)
                .map((att, idx) => (
                  <button
                    key={att.url + idx}
                    type="button"
                    onClick={() => setPreviewImg(att.url)}
                    className="group overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 text-left"
                  >
                    <img
                      src={att.url}
                      alt={att.alt || `${exp.role} image ${idx + 1}`}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </button>
                ))}
            </div>
          </section>
        )}

        {exp.githubUrls?.length > 0 && (
          <section className="border-t border-[#DCD9D1] pt-8">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
              Repositories
            </p>
            <div className="flex flex-wrap gap-5">
              {exp.githubUrls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link"
                >
                  <FiGithub size={14} /> Repository {idx + 1}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <Lightbox
        image={previewImg}
        title={`${exp.role} — ${exp.company}`}
        onClose={() => setPreviewImg(null)}
      />
    </article>
  );
}
