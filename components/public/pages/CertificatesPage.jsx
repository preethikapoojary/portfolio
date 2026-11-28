'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';
import Lightbox from '@/components/public/common/Lightbox';
import ShareMenu from '@/components/public/common/ShareMenu';
import { downloadCertificatePdf } from '@/utils/downloadCertificatePdf';

export default function CertificatesPage() {
  const { data: items, loading } = useFetch(api.getCertificates, []);
  const [selected, setSelected] = useState(null);
  const [downloadingId, setDownloadingId] = useState('');

  const handleDownload = async (cert) => {
    if (!cert.image?.url || downloadingId) return;
    setDownloadingId(cert._id);
    try {
      await downloadCertificatePdf(cert.image.url, cert.title);
    } finally {
      setDownloadingId('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Credentials"
        title={!loading && items ? `Certificates (${items.length})` : 'Certificates'}
        description="Verified coursework, technical specializations, and workshop credentials."
      />

      {loading ? (
        <p className="py-12 text-sm text-[#89877F]">Loading certificates…</p>
      ) : !items?.length ? (
        <p className="py-12 text-sm text-[#89877F]">No certificates listed yet.</p>
      ) : (
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cert) => {
            const certPath = `/certificates/${cert.slug || cert._id}`;
            return (
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

                <Link
                  href={certPath}
                  className="font-display text-xl font-medium leading-snug text-[#22221F] transition-colors hover:text-[#85806D]"
                >
                  {cert.title}
                </Link>

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
                    <ShareMenu path={certPath} title={cert.title} />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
                  {cert.image?.url && (
                    <button
                      type="button"
                      onClick={() => handleDownload(cert)}
                      disabled={downloadingId === cert._id}
                      className="inline-flex items-center gap-1.5 border border-[#DCD9D1] px-3 py-1.5 text-xs font-medium text-[#22221F] transition-colors hover:border-[#22221F] disabled:opacity-60"
                    >
                      <FiDownload size={12} />
                      {downloadingId === cert._id ? 'Preparing…' : 'Download PDF'}
                    </button>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#22221F] hover:text-[#85806D]"
                    >
                      Verify credential <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
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
