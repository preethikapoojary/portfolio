'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';
import { downloadTestimonialImage } from '@/utils/downloadTestimonialImage';

export default function TestimonialDetail({ slug }) {
  const { data: item, loading, error } = useFetch(
    () => api.getTestimonialBySlug(slug),
    [slug]
  );
  const [downloading, setDownloading] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-sm text-[#89877F] sm:px-8">
        Loading testimonial…
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
        <p className="text-sm text-[#89877F]">Testimonial not found.</p>
        <Link href="/testimonials" className="editorial-link mt-4">
          <FiArrowLeft size={14} /> Back to Testimonials
        </Link>
      </div>
    );
  }

  const sharePath = `/testimonials-${item.slug || item._id}`;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadTestimonialImage(item);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 sm:px-8">
      <header className="border-b border-[#DCD9D1] pb-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
          Testimonial
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
          {item.name}
        </h1>
        {(item.role || item.company) && (
          <p className="mt-3 text-sm text-[#89877F] sm:text-base">
            {[item.role, item.company].filter(Boolean).join(', ')}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 border border-[#22221F] bg-[#22221F] px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D] disabled:opacity-60"
          >
            <FiDownload size={13} />
            {downloading ? 'Preparing Image…' : 'Download Image'}
          </button>
          <ShareMenu
            path={sharePath}
            title={`Testimonial by ${item.name}`}
          />
        </div>
      </header>

      <blockquote className="mt-10 border border-[#DCD9D1] bg-[#E9E5DC]/25 p-8 sm:p-12">
        <p className="text-center font-display text-xl italic leading-relaxed text-[#22221F] sm:text-2xl">
          “{item.message}”
        </p>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCD9D1] pt-6">
          <div className="flex items-center gap-4">
            {item.avatar?.url ? (
              <img
                src={item.avatar.url}
                alt={item.name}
                className="h-14 w-14 rounded-full border border-[#DCD9D1] object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DCD9D1] bg-[#E9E5DC] font-display text-xl font-semibold text-[#22221F]">
                {item.name?.charAt(0)?.toUpperCase() || 'T'}
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-[#22221F]">{item.name}</p>
              {(item.role || item.company) && (
                <p className="text-xs text-[#89877F]">
                  {[item.role, item.company].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          {(item.linkedinUrl || item.githubUrl) && (
            <div className="flex items-center gap-4 text-[#89877F]">
              {item.linkedinUrl && (
                <a
                  href={item.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors hover:text-[#22221F]"
                >
                  <FiLinkedin size={14} /> LinkedIn
                </a>
              )}
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors hover:text-[#22221F]"
                >
                  <FiGithub size={14} /> GitHub
                </a>
              )}
            </div>
          )}
        </footer>
      </blockquote>

      <div className="mt-10 text-center">
        <Link href="/testimonials" className="editorial-link text-sm">
          <FiArrowLeft size={14} /> All Testimonials
        </Link>
      </div>
    </div>
  );
}
