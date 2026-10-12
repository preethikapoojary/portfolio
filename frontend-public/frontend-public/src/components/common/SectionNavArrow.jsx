import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronsDown, FiChevronsUp } from 'react-icons/fi';

/**
 * SectionNavArrow
 * Reusable double-arrow navigation button displayed at the bottom-right of homepage sections.
 * Dynamically determines and scrolls smoothly to the next section in sequence.
 * On the final section, it transforms into a scroll-to-top button returning to Home.
 */
export default function SectionNavArrow({
  currentId,
  nextId,
  isLast = false,
  className = 'absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-20',
}) {
  const [last, setLast] = useState(isLast);

  useEffect(() => {
    if (isLast) {
      setLast(true);
      return;
    }
    const updateLastState = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      if (sections.length > 0 && sections[sections.length - 1]?.id === currentId) {
        setLast(true);
      } else {
        setLast(false);
      }
    };
    updateLastState();
    const timer = setTimeout(updateLastState, 400);
    return () => clearTimeout(timer);
  }, [currentId, isLast]);

  const handleScroll = (e) => {
    e.preventDefault();
    if (last) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      return;
    }

    const sections = Array.from(document.querySelectorAll('section[id]'));
    const idx = sections.findIndex((s) => s.id === currentId);

    if (idx !== -1 && idx === sections.length - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      return;
    }

    if (idx !== -1 && idx < sections.length - 1) {
      const next = sections[idx + 1];
      next.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${next.id}`);
      return;
    }

    if (nextId) {
      const target = document.getElementById(nextId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${nextId}`);
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '/');
  };

  return (
    <div className={className}>
      <motion.button
        type="button"
        onClick={handleScroll}
        aria-label={last ? 'Scroll to top' : 'Scroll to next section'}
        className="glass-card flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:scale-110 hover:text-primary hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        {last ? (
          <FiChevronsUp className="text-lg sm:text-xl" />
        ) : (
          <FiChevronsDown className="text-lg sm:text-xl" />
        )}
      </motion.button>
    </div>
  );
}
