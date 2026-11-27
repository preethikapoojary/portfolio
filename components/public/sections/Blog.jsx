'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';

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
            Articles &amp; Notes
          </h2>
          <p className="mt-2.5 text-sm text-[#89877F] sm:text-base">
            Technical writing, learnings, and project reflections.
          </p>
        </div>

        <div className="divide-y divide-[#DCD9D1]">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group grid gap-4 py-7 first:pt-2 last:pb-2 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <div className="text-sm text-[#89877F] md:col-span-3">
                {post.publishedAt &&
                  new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
              </div>

              <div className="md:col-span-7">
                <h3 className="font-display text-3xl font-medium text-[#22221F] transition-colors group-hover:text-[#85806D]">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-base text-[#89877F]">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 md:col-span-2 md:justify-end">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#22221F] group-hover:text-[#85806D]">
                  Read <FiArrowRight size={14} />
                </span>
                <ShareMenu path={`/blog/${post.slug}`} title={post.title} />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="editorial-link text-base">
            Read All Articles <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
