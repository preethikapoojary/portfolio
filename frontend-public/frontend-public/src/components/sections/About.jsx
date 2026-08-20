import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import { useSettings } from '../../context/SettingsContext';

export default function About() {
  const { profile } = useSettings();

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="About" title="A little about me" />
      <div className="grid items-center gap-12 md:grid-cols-[1fr_1.4fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card mx-auto aspect-square w-56 overflow-hidden sm:w-72"
        >
          {profile?.profilePhoto?.url ? (
            <img
              src={profile.profilePhoto.url}
              alt={profile?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-4xl text-slate-600">
              {profile?.name?.[0] || '?'}
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="whitespace-pre-line text-lg leading-relaxed text-slate-300"
        >
          {profile?.aboutMe || 'This is where your about-me content will appear once added from the Admin Dashboard.'}
        </motion.p>
      </div>
    </section>
  );
}
