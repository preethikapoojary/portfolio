import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="mb-12 max-w-2xl"
    >
      {eyebrow && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
    </motion.div>
  );
}
