import { useState } from 'react';
import { FiMapPin, FiExternalLink, FiAward } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import Lightbox from '../common/Lightbox';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Experience() {
  const { data: experience, loading } = useFetch(api.getExperience, []);
  const [proofImage, setProofImage] = useState(null);

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading eyebrow="Experience" title="Where I've worked" />
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse" />
          ))}
        </div>
      ) : !experience?.length ? (
        <EmptyState message="Experience entries will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="relative border-l border-white/10 pl-8">
          {experience.map((role, i) => {
            const hasProof = role.proofFile?.url || role.proofUrl;
            return (
              <TiltCard
                key={role._id}
                delay={i * 0.06}
                className="glass-card relative mb-8 p-6 last:mb-0 transition-shadow hover:shadow-glow"
              >
                <span
                  className="absolute -left-[2.6rem] top-8 h-3 w-3 rounded-full ring-4 ring-surface"
                  style={{ background: 'var(--color-primary)' }}
                />

                <h3 className="font-display text-xl font-semibold">{role.role}</h3>
                <p className="mt-0.5 text-sm font-medium text-slate-300">{role.company}</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-slate-500">
                  {role.location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin size={12} /> {role.location}
                    </span>
                  )}
                  <span>{formatRange(role.startDate, role.endDate, role.isCurrent)}</span>
                </div>

                {role.description && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{role.description}</p>
                )}

                {role.responsibilities?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      What I worked on
                    </p>
                    <ul className="space-y-1.5">
                      {role.responsibilities.map((item, j) => (
                        <li key={j} className="flex gap-2 text-sm text-slate-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {role.technologies?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {role.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasProof && (
                  <div className="mt-5">
                    {role.proofFile?.url ? (
                      <button
                        type="button"
                        onClick={() => setProofImage(role)}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <FiAward size={14} /> View Certificate
                      </button>
                    ) : (
                      <a
                        href={role.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <FiAward size={14} /> View Certificate <FiExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      )}

      {proofImage && (
        <Lightbox
          image={proofImage.proofFile?.url}
          caption={`${proofImage.role} · ${proofImage.company}`}
          onClose={() => setProofImage(null)}
        />
      )}
    </section>
  );
}

function formatRange(start, end, isCurrent) {
  const s = start ? new Date(start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';
  const e = isCurrent ? 'Present' : end ? new Date(end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present';
  return `${s} — ${e}`;
}
