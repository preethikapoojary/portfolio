'use client';

import { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';
import Lightbox from '@/components/public/common/Lightbox';
import ShareMenu from '@/components/public/common/ShareMenu';

export default function CertificatesPage() {
  const { data: items, loading } = useFetch(api.getCertificates, []);
  const [selected, setSelected] = useState(null);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Credentials"
        title="Certificates"
        description="Verified coursework, technical specializations, and workshop credentials."
      />

      {loading ? (
        <p className="py-12 text-sm text-[#89877F]">Loading certificates…</p>
      ) : !items?.length ? (
        <p className="py-12 text-sm text-[#89877F]">No certificates listed yet.</p>
      ) : (
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cert) => (
            <article key={cert._id} className="group flex flex-col">
              {cert.image?.url && (
                <button
                  type="button"
                  onClick={() => setSelected(cert)}
                  className="mb-4 block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 p-2 text-left"
                >
                  <img
                    src={cert.image.url}
                    alt={cert.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </button>
              )}

              <h2 className="font-display text-xl font-medium leading-snug text-[#22221F]">
                {cert.title}
              </h2>

              <div className="mt-2 flex items-start justify-between gap-3">
                <div className="min-w-0 text-sm text-[#89877F]">
                  {cert.issuer && <p>{cert.issuer}</p>}
                  {cert.issueDate && (
                    <p className="mt-1 text-xs">
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <ShareMenu path={cert.credentialUrl || '/certificates'} title={cert.title} />
                </div>
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-[#22221F] hover:text-[#85806D]"
                >
                  Verify credential <FiExternalLink size={12} />
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      <Lightbox
        image={selected?.image?.url}
        title={selected?.title}
        subtitle={selected?.issuer}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
