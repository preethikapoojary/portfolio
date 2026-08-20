import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Blog() {
  const { data, loading } = useFetch(() => api.getBlogPosts({ limit: 3 }), []);
  const posts = data?.items || data || [];

  return (
    <section id="blog" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Blog" title="Writing" subtitle="Notes on things I'm building and learning." />
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-56 animate-pulse" />
          ))}
        </div>
      ) : !posts.length ? (
        <EmptyState message="Blog posts will appear here once published from the Admin Dashboard." />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post._id || post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-card overflow-hidden transition hover:-translate-y-1 hover:shadow-glow"
            >
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
                <Link to={`/blog/${post.slug}`} className="mt-3 inline-block text-sm text-primary hover:underline">
                  Read more →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
