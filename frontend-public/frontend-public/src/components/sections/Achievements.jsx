import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import DynamicIcon from '../common/DynamicIcon';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Achievements() {
  const { data: achievements, loading } = useFetch(api.getAchievements, []);

  return (
    <section id="achievements" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Achievements" title="Milestones worth mentioning" />
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-32 animate-pulse" />
          ))}
        </div>
      ) : !achievements?.length ? (
        <EmptyState message="Achievements will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card p-6 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <DynamicIcon icon={item.icon} fallback={FiAward} className="mb-3 text-2xl text-accent" />
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
