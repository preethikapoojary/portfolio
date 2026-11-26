'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiMapPin,
  FiGithub,
  FiExternalLink,
  FiFileText,
  FiDownload,
  FiAward,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import useFetch from '@/hooks/useFetch';
import api from '@/api/endpoints';
import LoadingScreen from '@/components/public/layout/LoadingScreen';

function formatRange(start, end, isCurrent) {
  const s = start
    ? new Date(start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '';
  const e = isCurrent
    ? 'Present'
    : end
      ? new Date(end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : 'Present';
  return `${s} — ${e}`;
}

export default function ExperienceDetail() {
  const { id } = useParams();
  const { data: role, loading, error } = useFetch(() => api.getExperienceById(id), [id]);

  if (loading) return <LoadingScreen />;

  if (error || !role) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-40 text-center">
        <h1 className="font-display text-2xl">Experience not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          This experience entry may have been removed or is not available.
        </p>
        <Link
          href="/#experience"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <FiArrowLeft /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const hasProof = role.proofFile?.url || role.proofUrl;
  const hasCertificate = role.certificate?.url || hasProof;
  const hasReport = role.projectReportPdf?.url || role.projectReportUrl;
  const hasGithub = role.githubUrls?.length > 0;
  const hasProjects = role.relatedProjects?.length > 0;
  const hasAttachments = role.attachments?.filter((a) => a?.url)?.length > 0;

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      {/* Back button */}
      <Link
        href="/#experience"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-4xl font-semibold">{role.role}</h1>
        <p className="mt-1 text-lg font-medium text-slate-300">{role.company}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-sm text-slate-500">
          {role.location && (
            <span className="flex items-center gap-1">
              <FiMapPin size={14} /> {role.location}
            </span>
          )}
          <span>{formatRange(role.startDate, role.endDate, role.isCurrent)}</span>
        </div>
      </motion.div>

      {/* Technologies */}
      {role.technologies?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-5 flex flex-wrap gap-2"
        >
          {role.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      )}

      {/* Description */}
      {role.description && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8"
        >
          <SectionLabel>Overview</SectionLabel>
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-300">
            {role.description}
          </p>
        </motion.div>
      )}

      {/* Responsibilities */}
      {role.responsibilities?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <SectionLabel>Responsibilities</SectionLabel>
          <ul className="space-y-2">
            {role.responsibilities.map((item, j) => (
              <li key={j} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Related Projects */}
      {hasProjects && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-10"
        >
          <SectionLabel>Projects</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {role.relatedProjects.map((proj, i) => (
              <div key={i} className="glass-card p-5 transition-shadow hover:shadow-glow">
                <h4 className="font-display text-base font-semibold">{proj.name}</h4>
                {proj.description && (
                  <p className="mt-1 text-sm text-slate-400">{proj.description}</p>
                )}
                <div className="mt-3 flex gap-4 text-sm">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <FiGithub size={14} /> Source
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <FiExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* GitHub Repositories */}
      {hasGithub && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10"
        >
          <SectionLabel>GitHub Repositories</SectionLabel>
          <div className="space-y-2">
            {role.githubUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="glass-card flex items-center gap-3 px-5 py-3 text-sm text-slate-300 transition-shadow hover:shadow-glow hover:text-primary"
              >
                <FiGithub className="shrink-0 text-base" />
                <span className="truncate">{url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                <FiExternalLink className="ml-auto shrink-0 text-slate-500" size={14} />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Project Report */}
      {hasReport && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-10"
        >
          <SectionLabel>Project Report</SectionLabel>
          <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <FiFileText className="text-2xl text-primary" />
              <div>
                <p className="font-medium">Project Report</p>
                <p className="text-xs text-slate-500">Detailed write-up / case study</p>
              </div>
            </div>
            <div className="flex gap-3">
              {role.projectReportPdf?.url ? (
                <>
                  <a
                    href={role.projectReportPdf.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-card flex items-center gap-2 px-4 py-2 text-sm font-medium"
                  >
                    <FiFileText size={14} /> View
                  </a>
                  <a
                    href={role.projectReportPdf.url}
                    download
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-surface"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    }}
                  >
                    <FiDownload size={14} /> Download
                  </a>
                </>
              ) : role.projectReportUrl ? (
                <a
                  href={role.projectReportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-surface"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  }}
                >
                  <FiExternalLink size={14} /> View Report
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}

      {/* Certificate */}
      {hasCertificate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10"
        >
          <SectionLabel>Certificate</SectionLabel>
          {(role.certificate?.url || role.proofFile?.url) ? (
            <div className="glass-card overflow-hidden">
              <img
                src={role.certificate?.url || role.proofFile.url}
                alt={`${role.role} at ${role.company} — Certificate`}
                className="w-full object-contain"
              />
            </div>
          ) : role.proofUrl ? (
            <a
              href={role.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="glass-card inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-primary hover:shadow-glow"
            >
              <FiAward size={16} /> View Certificate <FiExternalLink size={12} />
            </a>
          ) : null}
        </motion.div>
      )}

      {/* Supporting Images / Documents */}
      {hasAttachments && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-10"
        >
          <SectionLabel>Supporting Documents</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {role.attachments
              .filter((a) => a?.url)
              .map((att, i) => (
                <div key={i} className="glass-card overflow-hidden transition hover:scale-[1.02]">
                  <img
                    src={att.url}
                    alt={att.alt || `Attachment ${i + 1}`}
                    className="w-full object-contain"
                  />
                  {att.alt && (
                    <p className="px-4 py-2 text-center text-xs text-slate-400">{att.alt}</p>
                  )}
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </article>
  );
}

/** Small heading label used to separate sections on the detail page. */
function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}
