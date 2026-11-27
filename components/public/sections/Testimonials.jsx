'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';

export default function Testimonials() {
  const { data: items, loading } = useFetch(api.getApprovedTestimonials, []);
  if (loading) return null;

  const approved = items || [];

  return (
    <section
      id="testimonials"
      className="flex flex-col justify-center border-t border-[#DCD9D1] py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 border-b border-[#DCD9D1] pb-6 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
            Testimonials
          </h2>
          <p className="mt-2.5 text-sm text-[#89877F] sm:text-base">
            Words from collaborators, peers, and mentors.
          </p>
        </div>

        {approved.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {approved.slice(0, 4).map((t) => (
              <blockquote
                key={t._id}
                className="flex flex-col justify-between border border-[#DCD9D1] bg-[#E9E5DC]/25 p-7"
              >
                <p className="text-base leading-relaxed text-[#22221F] sm:text-lg">
                  “{t.message}”
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-[#DCD9D1] pt-4">
                  {t.avatar?.url && (
                    <img
                      src={t.avatar.url}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#22221F]">{t.name}</p>
                    {(t.role || t.company) && (
                      <p className="text-xs text-[#89877F]">
                        {[t.role, t.company].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-base text-[#89877F]">
            No testimonials published yet. Be the first to share a note.
          </p>
        )}

        <div className="mt-12 text-center">
          <Link href="/testimonials" className="editorial-link text-base">
            Leave a Testimonial <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
