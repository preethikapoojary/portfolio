'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import Lightbox from '@/components/public/common/Lightbox';

export default function Certificates() {
  const { data: items, loading } = useFetch(api.getCertificates, []);
  const [selected, setSelected] = useState(null);

  if (loading || !items?.length) return null;

  const previewItems = items.slice(0, 3);

  return (
    <section
      id="certificates"
      className="flex flex-col justify-center border-t border-[#DCD9D1] bg-[#E9E5DC]/35 py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 border-b border-[#DCD9D1] pb-6 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
            Certificates
          </h2>
          <p className="mt-2.5 text-sm text-[#89877F] sm:text-base">
            Verified coursework, technical specializations, and workshop credentials.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {previewItems.map((cert) => (
            <article key={cert._id} className="group flex flex-col">
              {cert.image?.url && (
                <button
                  type="button"
                  onClick={() => setSelected(cert)}
                  className="mb-4 block overflow-hidden border border-[#DCD9D1] bg-[#F6F4EF] p-2.5 text-left"
                >
                  <img
                    src={cert.image.url}
                    alt={cert.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </button>
              )}

              <h3 className="font-display text-xl font-medium leading-snug text-[#22221F]">
                {cert.title}
              </h3>

              <div className="mt-2 flex items-center justify-between gap-2 text-sm text-[#89877F]">
                <span>{cert.issuer}</span>
                {cert.issueDate && (
                  <span>
                    {new Date(cert.issueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#22221F] hover:text-[#85806D]"
                >
                  Verify credential <FiExternalLink size={12} />
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/certificates" className="editorial-link text-base">
            View All Certificates <FiArrowRight size={15} />
          </Link>
        </div>
      </div>

      <Lightbox
        image={selected?.image?.url}
        title={selected?.title}
        subtitle={selected?.issuer}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
