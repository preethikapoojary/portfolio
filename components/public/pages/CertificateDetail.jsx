'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiDownload, FiExternalLink } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';
import { downloadCertificatePdf } from '@/utils/downloadCertificatePdf';

export default function CertificateDetail({ slug }) {
  const { data: cert, loading, error } = useFetch(
    () => api.getCertificateBySlug(slug),
    [slug]
  );
  const [downloading, setDownloading] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-sm text-[#89877F] sm:px-8">
        Loading certificate…
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <p className="text-sm text-[#89877F]">Certificate not found.</p>
        <Link href="/certificates" className="editorial-link mt-4">
          <FiArrowLeft size={14} /> Back to Certificates
        </Link>
      </div>
    );
  }

  const sharePath = `/certificates/${cert.slug || cert._id}`;

  const handleDownload = async () => {
    if (!cert.image?.url || downloading) return;
    setDownloading(true);
    try {
      await downloadCertificatePdf(cert.image.url, cert.title);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 sm:px-8">
      <header className="border-b border-[#DCD9D1] pb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
          Credential
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
          {cert.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 text-sm text-[#89877F]">
            {cert.issuer && <p className="font-medium text-[#22221F]">{cert.issuer}</p>}
            {cert.issueDate && (
              <p className="text-xs">
                Issued{' '}
                {new Date(cert.issueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {cert.image?.url && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 border border-[#22221F] bg-[#22221F] px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D] disabled:opacity-60"
              >
                <FiDownload size={13} />
                {downloading ? 'Preparing PDF…' : 'Download PDF'}
              </button>
            )}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#DCD9D1] px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#22221F] transition-colors hover:border-[#22221F]"
              >
                Verify <FiExternalLink size={12} />
              </a>
            )}
            <ShareMenu path={sharePath} title={cert.title} />
          </div>
        </div>
      </header>

      {cert.image?.url && (
        <div className="mt-10 border border-[#DCD9D1] bg-[#E9E5DC]/35 p-3 sm:p-5">
          <img
            src={cert.image.url}
            alt={cert.title}
            className="mx-auto max-h-[75vh] w-full object-contain"
          />
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/certificates" className="editorial-link text-base">
          All Certificates <FiArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
