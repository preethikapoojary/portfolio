import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiZoomIn, FiArrowLeft } from 'react-icons/fi';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import Lightbox from '../components/common/Lightbox';
import TiltCard from '../components/common/TiltCard';
import useFetch from '../hooks/useFetch';
import api from '../api/endpoints';

export default function CertificatesPage() {
  const { data: certificates, loading } = useFetch(api.getCertificates, []);
  const [active, setActive] = useState(null);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Link
        to="/"
        className="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      <SectionHeading
        eyebrow="Certificates"
        title="All Courses & Credentials"
        subtitle="Certifications, online achievements, and verified credentials."
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-56 animate-pulse" />
          ))}
        </div>
      ) : !certificates?.length ? (
        <EmptyState message="Certificates will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
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
      )}

      {active && (
        <Lightbox
          image={active.image?.url}
          caption={active.title}
          subcaption={active.issuer}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
