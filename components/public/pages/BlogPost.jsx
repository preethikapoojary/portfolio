'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useFetch } from '@/hooks/useFetch';
import api from '@/api/endpoints';
import ShareMenu from '@/components/public/common/ShareMenu';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading } = useFetch(() => api.getBlogPostBySlug(slug), [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8">
        <p className="text-sm text-[#89877F]">Loading article…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8">
        <p className="font-display text-2xl text-[#22221F]">Article not found</p>
        <Link href="/blog" className="editorial-link mt-4">
          <FiArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
      <Link href="/blog" className="editorial-link mb-8">
        <FiArrowLeft size={14} /> All Articles
      </Link>

      <header className="border-b border-[#DCD9D1] pb-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            {post.category || 'Article'}
            {post.publishedAt
              ? ` · ${new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}`
              : ''}
          </p>
          <ShareMenu title={post.title} />
        </div>

        <h1 className="font-display text-4xl font-medium leading-[1.12] tracking-tight text-[#22221F] sm:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-base leading-relaxed text-[#89877F] sm:text-lg">
            {post.excerpt}
          </p>
        )}
      </header>

      {post.coverImage?.url && (
        <div className="my-10 border border-[#DCD9D1] bg-[#E9E5DC]/40 p-2">
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {post.content && (
        <div
          className="editorial-prose mt-10 text-base"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </article>
  );
}
