import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import TiltCard from '../common/TiltCard';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Skills() {
  const { data: skills, loading } = useFetch(api.getSkills, []);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Skills" title="What I work with" />
      {loading ? (
        <SkeletonGrid />
      ) : !skills?.length ? (
        <EmptyState message="Skills will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, i) => (
            <TiltCard key={skill._id} delay={i * 0.04} className="glass-card p-5 transition-shadow hover:shadow-glow">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium">{skill.name}</span>
                <span className="font-mono text-xs text-slate-400">{skill.proficiency}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}
                />
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card h-20 animate-pulse" />
      ))}
    </div>
  );
}
