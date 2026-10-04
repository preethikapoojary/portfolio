import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiZoomIn } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import Lightbox from '../common/Lightbox';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Certificates() {
  const { data: certificates, loading } = useFetch(api.getCertificates, []);
  const [active, setActive] = useState(null);
  const featuredCertificates = (certificates || []).slice(0, 3);

  return (
    <section id="certificates" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Certificates" title="Courses & credentials" />
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-56 animate-pulse" />
          ))}
        </div>
      ) : !certificates?.length ? (
        <EmptyState message="Certificates will appear here once added from the Admin Dashboard." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCertificates.map((cert, i) => (
              <TiltCard
                key={cert._id}
                delay={i * 0.05}
                className="glass-card group overflow-hidden transition-shadow hover:shadow-glow flex flex-col justify-between"
              >
                {cert.image?.url && (
                  <button
                    type="button"
                    onClick={() => setActive(cert)}
                    className="relative block aspect-[4/3] w-full overflow-hidden"
                    aria-label={`View ${cert.title} certificate`}
                  >
                    <img
                      src={cert.image.url}
                      alt={cert.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                      <FiZoomIn className="text-2xl text-white" />
                    </div>
                  </button>
                )}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-medium">{cert.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{cert.issuer}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">
                      {cert.issueDate ? new Date(cert.issueDate).getFullYear() : ''}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Verify Credential <FiExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/certificates"
              className="glass-card inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-slate-200 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
            >
              View More Certificates →
            </Link>
          </div>
        </>
      )}

      {active && (
        <Lightbox
          image={active.image?.url}
          caption={active.title}
          subcaption={active.issuer}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
