'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import SectionHeading from '@/components/public/common/SectionHeading';

export default function Blog() {
  const { data: posts, loading } = useFetch(() => api.getBlogPosts(), []);
  if (loading || !posts?.length) return null;

  return (
    <section
      id="blog"
      className="flex flex-col justify-center border-t border-[#DCD9D1] py-16 lg:min-h-[calc(100vh-4rem)] lg:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeading
          number="06"
          eyebrow="Writing"
          title="Articles & Notes"
          actionLabel="Read All Articles"
          actionHref="/blog"
        />

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

              <div className="flex items-center md:col-span-2 md:justify-end">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#22221F] group-hover:text-[#85806D]">
                  Read <FiArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
