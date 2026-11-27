'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import PageHeader from '@/components/public/common/PageHeader';

export default function BlogPage() {
  const { data: posts, loading } = useFetch(() => api.getBlogPosts(), []);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
      <PageHeader
        eyebrow="Writing"
        title="Articles & Notes"
        description="Technical notes, learnings, and project reflections."
      />

      {loading ? (
        <p className="py-12 text-sm text-[#89877F]">Loading articles…</p>
      ) : !posts?.length ? (
        <div className="py-16">
          <p className="font-display text-2xl text-[#22221F]">No articles published yet.</p>
          <p className="mt-2 text-sm text-[#89877F]">
            Check back later for technical writing and project notes.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#DCD9D1] py-6">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group grid gap-6 py-8 md:grid-cols-12 md:items-center"
            >
              {post.coverImage?.url && (
                <div className="overflow-hidden border border-[#DCD9D1] bg-[#E9E5DC]/40 md:col-span-3">
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
              )}

              <div className={post.coverImage?.url ? 'md:col-span-7' : 'md:col-span-10'}>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#89877F]">
                  {post.category || 'Article'}
                  {post.publishedAt
                    ? ` · ${new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}`
                    : ''}
                </p>
                <h2 className="font-display text-2xl font-medium text-[#22221F] transition-colors group-hover:text-[#85806D] sm:text-3xl">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-[#89877F]">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center md:col-span-2 md:justify-end">
                <span className="editorial-link">
                  Read <FiArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
