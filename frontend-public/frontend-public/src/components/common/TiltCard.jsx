import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Wraps a card with: (1) the same fade-up-on-scroll entrance every section
 * already used, (2) a gentle mouse-tracked 3D tilt capped at maxTilt
 * degrees, (3) a slight lift + scale on hover. Framer Motion merges all of
 * these into one transform, so there's no fighting with Tailwind's own
 * transform utilities — the card's visual styling (glass background,
 * border, shadow) stays entirely in the child's className, untouched.
 *
 * Used by: Skills, Projects, Experience, Certificates, Testimonials.
 */
export default function TiltCard({ children, delay = 0, className = '', maxTilt = 4 }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springConfig = { stiffness: 260, damping: 22 };
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.015 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
