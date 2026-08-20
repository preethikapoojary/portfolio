import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Full-screen image viewer. Pass `onClose` to control open/close from the
 * parent, and optionally `onPrev`/`onNext` to enable arrow navigation
 * (used by Gallery; omitted by Certificates, which shows one image at a
 * time with no set to navigate through).
 */
export default function Lightbox({ image, caption, subcaption, onClose, onPrev, onNext }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
        >
          <FiX size={20} />
        </button>

        {onPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
          >
            <FiChevronLeft size={22} />
          </button>
        )}
        {onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
          >
            <FiChevronRight size={22} />
          </button>
        )}

        <motion.div
          key={image}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] max-w-4xl flex-col items-center"
        >
          <img src={image} alt={caption || ''} className="max-h-[75vh] w-auto rounded-lg object-contain shadow-2xl" />
          {(caption || subcaption) && (
            <div className="mt-4 text-center">
              {caption && <p className="text-sm font-medium text-white">{caption}</p>}
              {subcaption && <p className="mt-1 font-mono text-xs uppercase tracking-wide text-white/60">{subcaption}</p>}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
