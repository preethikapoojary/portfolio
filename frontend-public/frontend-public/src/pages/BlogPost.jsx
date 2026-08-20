import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import api from '../api/endpoints';
import LoadingScreen from '../components/layout/LoadingScreen';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useFetch(() => api.getBlogPostBySlug(slug), [slug]);

  if (loading) return <LoadingScreen />;

  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-40 text-center">
        <h1 className="font-display text-2xl">Post not found</h1>
        <Link to="/#blog" className="mt-4 inline-block text-primary hover:underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link to="/#blog" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <FiArrowLeft /> Back to blog
      </Link>

      {post.coverImage?.url && (
        <img src={post.coverImage.url} alt={post.title} className="glass-card mb-8 aspect-video w-full object-cover" />
      )}

      <p className="font-mono text-xs text-slate-500">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold">{post.title}</h1>

      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </article>
  );
}
