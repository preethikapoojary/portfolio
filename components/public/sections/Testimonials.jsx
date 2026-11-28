'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';
import VerifiedProfileLinks from '@/components/public/common/VerifiedProfileLinks';
import { downloadTestimonialImage } from '@/utils/downloadTestimonialImage';
import { getCroppedImageStyle } from '@/utils/croppedImage';

export default function Testimonials() {
  const { data: items, loading } = useFetch(api.getApprovedTestimonials, []);
  if (loading) return null;

  const approved = items || [];
  const hasHomeOrder = approved.some((t) => t.homeOrder !== null && t.homeOrder !== undefined);
  const homeItems = hasHomeOrder
    ? [...approved]
        .filter((t) => t.homeOrder !== null && t.homeOrder !== undefined)
        .sort((a, b) => a.homeOrder - b.homeOrder)
        .slice(0, 6)
    : approved.slice(0, 4);

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

        {homeItems.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {homeItems.map((t) => {
              const itemPath = `/testimonials/${t.slug || t._id}`;
              return (
              <blockquote
                key={t._id}
                className="flex flex-col justify-between border border-[#DCD9D1] bg-[#E9E5DC]/25 p-7 transition-colors hover:border-[#85806D]"
              >
                <div className="flex-1">
                  <p className="text-base leading-relaxed text-[#22221F] sm:text-lg">
                    “{t.message}”
                  </p>
                </div>
                <footer className="mt-6 flex items-center justify-between gap-3 border-t border-[#DCD9D1] pt-4">
                  <Link href={itemPath} className="flex min-w-0 flex-1 items-center gap-3">
                    {t.avatar?.url && (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <img
                          src={t.avatar.url}
                          alt={t.name}
                          style={getCroppedImageStyle(t.avatar)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#22221F]">{t.name}</p>
                      {t.role && (
                        <p className="truncate text-xs text-[#89877F]">{t.role}</p>
                      )}
                    </div>
                  </Link>
                  <div className="flex shrink-0 items-center gap-2">
                    <VerifiedProfileLinks item={t} />
                    <ShareMenu
                      path={itemPath}
                      title={`Testimonial by ${t.name}`}
                      onDownload={() => downloadTestimonialImage(t)}
                    />
                  </div>
                </footer>
              </blockquote>
              );
            })}
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
