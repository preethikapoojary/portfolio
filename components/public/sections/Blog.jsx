'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';
import { getCroppedImageStyle } from '@/utils/croppedImage';
import { formatCalendarDate } from '@/utils/date';

export default function Blog() {
  const { data: posts, loading } = useFetch(() => api.getBlogPosts(), []);
  if (loading || !posts?.length) return null;

  return (
    <section
      id="blog"
      className="flex flex-col justify-center border-t border-[#DCD9D1] bg-[#E9E5DC]/35 py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="mb-10 border-b border-[#DCD9D1] pb-6 text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
            My Blogs
          </h2>
          <p className="mt-2.5 text-sm text-[#89877F] sm:text-base">
            Technical writing, learnings, and project reflections.
          </p>
        </div>

        <div className="divide-y divide-[#DCD9D1]">
          {posts.slice(0, 3).map((post, index) => {
            const num = String(index + 1).padStart(2, '0');
            const imageFirst = index % 2 === 1;
            const detailHref = `/blog/${post.slug}`;
            const dateText = post.publishedAt ? formatCalendarDate(post.publishedAt) : '';

            return (
              <article
                key={post._id}
                className="grid items-center gap-8 py-12 first:pt-2 last:pb-2 lg:grid-cols-12 lg:gap-12"
              >
                <div className={`lg:col-span-6 ${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-[#89877F]">
                    <span>{num}</span>
                    {dateText && (
                      <>
                        <span>/</span>
                        <span>{dateText}</span>
                      </>
                    )}
                  </div>

                  <Link href={detailHref} className="group block">
                    <h3 className="font-display text-3xl font-medium tracking-tight text-[#22221F] transition-colors group-hover:text-[#85806D] sm:text-4xl">
                      {post.title}
                    </h3>
                  </Link>

                  <Link
                    href={detailHref}
                    className="group my-5 block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 lg:hidden"
                  >
                    {post.coverImage?.url ? (
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        style={getCroppedImageStyle(post.coverImage)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E9E5DC] px-6 text-center">
                        <span className="font-display text-3xl text-[#85806D]">
                          {post.title}
                        </span>
                      </div>
                    )}
                  </Link>

                  {post.excerpt && (
                    <p className="mt-4 text-base leading-relaxed text-[#89877F] sm:text-lg">
                      {post.excerpt}
                    </p>
                  )}

                  {post.tags?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[#DCD9D1] bg-[#E9E5DC]/45 px-3 py-1 text-xs font-medium text-[#22221F]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <Link href={detailHref} className="editorial-link text-[15px]">
                      Read Article <FiArrowRight size={15} />
                    </Link>
                    <ShareMenu path={detailHref} title={post.title} />
                  </div>
                </div>

                <div className={`hidden lg:block lg:col-span-6 ${imageFirst ? 'lg:order-1' : 'lg:order-2'}`}>
                  <Link
                    href={detailHref}
                    className="group block overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40"
                  >
                    {post.coverImage?.url ? (
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        style={getCroppedImageStyle(post.coverImage)}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E9E5DC] px-6 text-center">
                        <span className="font-display text-3xl text-[#85806D]">
                          {post.title}
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="editorial-link text-base">
            Read All Blogs <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
