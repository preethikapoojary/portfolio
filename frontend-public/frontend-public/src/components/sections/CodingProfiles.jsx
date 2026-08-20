import { motion } from 'framer-motion';
import { FiCode } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import DynamicIcon from '../common/DynamicIcon';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function CodingProfiles() {
  const { data: profiles, loading } = useFetch(api.getCodingProfiles, []);

  return (
    <section id="coding_profiles" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Coding Profiles" title="Where I practice" />
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-20 animate-pulse" />
          ))}
        </div>
      ) : !profiles?.length ? (
        <EmptyState message="Coding profile links will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, i) => (
            <motion.a
              key={p._id}
              href={p.profileUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card flex items-center gap-3 p-5 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <DynamicIcon icon={p.icon} fallback={FiCode} className="text-xl text-primary" />
              <div>
                <p className="font-medium">{p.platform}</p>
                <p className="text-xs text-slate-500">@{p.username}</p>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}
