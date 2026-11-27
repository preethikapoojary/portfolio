'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiFileText, FiGithub } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import Lightbox from '@/components/public/common/Lightbox';

function formatRange(start, end, isCurrent) {
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  const s = fmt(start);
  const e = isCurrent ? 'Present' : fmt(end);
  return [s, e].filter(Boolean).join(' – ');
}

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
      <Link href="/experience" className="editorial-link mb-8">
        <FiArrowLeft size={14} /> All Experience
      </Link>

      <header className="border-b border-[#DCD9D1] pb-8">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
          {formatRange(exp.startDate, exp.endDate, exp.isCurrent)}
          {exp.location ? ` · ${exp.location}` : ''}
        </p>

        <h1 className="font-display text-4xl font-medium leading-[1.12] tracking-tight text-[#22221F] sm:text-5xl">
          {exp.role}
        </h1>

        <p className="mt-2 text-lg text-[#85806D]">{exp.company}</p>
      </header>

      <div className="space-y-10 py-10">
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
