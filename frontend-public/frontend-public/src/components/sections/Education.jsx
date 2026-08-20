import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import EmptyState from '../common/EmptyState';
import useFetch from '../../hooks/useFetch';
import api from '../../api/endpoints';

export default function Education() {
  const { data: education, loading } = useFetch(api.getEducation, []);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading eyebrow="Education" title="Academic background" />
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse" />
          ))}
        </div>
      ) : !education?.length ? (
        <EmptyState message="Education entries will appear here once added from the Admin Dashboard." />
      ) : (
        <div className="space-y-5">
          {education.map((edu, i) => {
            const isExpanded = expandedId === edu._id;
            const isLong = (edu.description || '').length > 220;
            return (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass-card p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{edu.institution}</h3>
                    <p className="text-sm text-slate-400">
                      {edu.degree} {edu.fieldOfStudy ? `· ${edu.fieldOfStudy}` : ''}
                    </p>
                    {edu.grade && <p className="text-xs text-slate-500">Grade: {edu.grade}</p>}
                  </div>
                  <p className="font-mono text-xs text-slate-500">
                    {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} —{' '}
                    {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  </p>
                </div>

                {edu.description && (
                  <>
                    <p
                      className={`mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-300 ${
                        !isExpanded && isLong ? 'line-clamp-3' : ''
                      }`}
                    >
                      {edu.description}
                    </p>
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : edu._id)}
                        className="mt-2 text-xs font-medium text-primary hover:underline"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
