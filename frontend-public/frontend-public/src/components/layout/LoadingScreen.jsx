import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-white/10"
        style={{ borderTopColor: 'var(--color-primary)' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
    </div>
  );
}
