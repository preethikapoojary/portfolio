import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZoomIn } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import Lightbox from '../common/Lightbox';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Gallery() {
  const { data, loading } = useFetch(() => api.getGallery(), []);
  const images = data?.items || data || [];
  const [activeIndex, setActiveIndex] = useState(null);

  const active = activeIndex !== null ? images[activeIndex] : null;
  const showPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Gallery" title="Moments & snapshots" />
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card aspect-square animate-pulse" />
          ))}
        </div>
      ) : !images.length ? (
        <EmptyState message="Gallery images will appear here once uploaded from the Admin Dashboard." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, i) => (
            <motion.button
              key={img._id}
              type="button"
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
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
    </section>
  );
}
