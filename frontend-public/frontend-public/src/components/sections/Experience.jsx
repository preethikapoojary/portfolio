import { Link } from 'react-router-dom';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import SectionNavArrow from '../common/SectionNavArrow';
import EmptyState from '../common/EmptyState';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Experience() {
  const { data: experience, loading } = useFetch(api.getExperience, []);

  return (
    <section id="experience" className="relative w-full px-6 py-24">
      <div className="mx-auto max-w-4xl">
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
          {experience.map((role, i) => (
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
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-300">
                  {role.description}
                </p>
              )}

              {role.technologies?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {role.technologies.length > 5 && (
                    <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-500">
                      +{role.technologies.length - 5}
                    </span>
                  )}
                </div>
              )}

              <Link
                to={`/experience/${role._id}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                View More <FiArrowRight size={14} />
              </Link>
            </TiltCard>
          ))}
        </div>
      )}
      </div>

      <SectionNavArrow currentId="experience" />
    </section>
  );
}

function formatRange(start, end, isCurrent) {
  const s = start ? new Date(start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';
  const e = isCurrent ? 'Present' : end ? new Date(end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present';
  return `${s} — ${e}`;
}
