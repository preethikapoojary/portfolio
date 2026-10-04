import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import useFetch from '../hooks/useFetch';
import api from '../api/endpoints';

export default function BlogPage() {
  const { data, loading } = useFetch(() => api.getBlogPosts(), []);
  const posts = data?.items || data || [];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Link
        to="/"
        className="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      <SectionHeading
        eyebrow="Blog"
        title="All Articles & Writing"
        subtitle="Notes, guides, and thoughts on software engineering and technology."
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card h-56 animate-pulse" />
          ))}
        </div>
      ) : !posts.length ? (
        <EmptyState message="Blog posts will appear here once published from the Admin Dashboard." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post._id || post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card overflow-hidden transition hover:-translate-y-1 hover:shadow-glow flex flex-col justify-between"
            >
              <div>
                {post.coverImage?.url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={post.coverImage.url} alt={post.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="font-mono text-xs text-slate-500">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{post.excerpt}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link to={`/blog/${post.slug}`} className="inline-block text-sm text-primary hover:underline">
                  Read more →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
