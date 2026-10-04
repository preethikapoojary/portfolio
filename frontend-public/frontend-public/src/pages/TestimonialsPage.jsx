import { Link } from 'react-router-dom';
import { FiStar, FiLinkedin, FiGithub, FiArrowLeft } from 'react-icons/fi';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import TiltCard from '../components/common/TiltCard';
import useFetch from '../hooks/useFetch';
import api from '../api/endpoints';

export default function TestimonialsPage() {
  const { data: testimonials, loading } = useFetch(api.getApprovedTestimonials, []);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Link
        to="/"
        className="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      <SectionHeading
        eyebrow="Testimonials"
        title="All Recommendations & Reviews"
        subtitle="Feedback and experiences shared by colleagues, clients, and collaborators."
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-40 animate-pulse" />
          ))}
        </div>
      ) : !testimonials?.length ? (
        <EmptyState message="Approved testimonials will appear here." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TiltCard
              key={t._id}
              delay={i * 0.05}
              className="glass-card p-6 transition-shadow hover:shadow-glow flex flex-col justify-between"
            >
              <div>
                {t.rating && (
                  <div className="mb-2 flex gap-1 text-accent">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <FiStar key={j} fill="currentColor" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-300">&ldquo;{t.message}&rdquo;</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                {t.avatar?.url ? (
                  <img src={t.avatar.url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm text-slate-400">
                    {t.name?.[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {t.role} {t.company ? `· ${t.company}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 text-slate-400">
                  {t.linkedinUrl && (
                    <a href={t.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
                      <FiLinkedin />
                    </a>
                  )}
                  {t.githubUrl && (
                    <a href={t.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary">
                      <FiGithub />
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
