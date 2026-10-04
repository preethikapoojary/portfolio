import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZoomIn, FiArrowLeft } from 'react-icons/fi';
import SectionHeading from '../components/common/SectionHeading';
import EmptyState from '../components/common/EmptyState';
import Lightbox from '../components/common/Lightbox';
import useFetch from '../hooks/useFetch';
import api from '../api/endpoints';

export default function GalleryPage() {
  const { data, loading } = useFetch(() => api.getGallery(), []);
  const images = data?.items || data || [];
  const [activeIndex, setActiveIndex] = useState(null);

  const active = activeIndex !== null ? images[activeIndex] : null;
  const showPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Link
        to="/"
        className="glass-card mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 transition duration-300 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
      >
        <FiArrowLeft /> Back to Portfolio
      </Link>

      <SectionHeading
        eyebrow="Gallery"
        title="All Moments & Snapshots"
        subtitle="A complete collection of snapshots, memories, and design highlights."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card aspect-square animate-pulse" />
          ))}
        </div>
      ) : !images.length ? (
        <EmptyState message="Gallery images will appear here once uploaded from the Admin Dashboard." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.button
              key={img._id}
              type="button"
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
              className="glass-card group relative aspect-square overflow-hidden text-left"
              aria-label={img.caption ? `View ${img.caption}` : 'View image'}
            >
              <img
                src={img.image?.url}
                alt={img.caption || ''}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
                <FiZoomIn className="text-xl text-white" />
              </div>
              {(img.caption || img.category) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  {img.caption && <p className="truncate text-sm font-medium text-white">{img.caption}</p>}
                  {img.category && (
                    <p className="font-mono text-[10px] uppercase tracking-wide text-white/70">{img.category}</p>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {active && (
        <Lightbox
          image={active.image?.url}
          caption={active.caption}
          subcaption={active.category}
          onClose={() => setActiveIndex(null)}
          onPrev={images.length > 1 ? showPrev : undefined}
          onNext={images.length > 1 ? showNext : undefined}
        />
      )}
    </div>
  );
}
