import { motion } from 'framer-motion';
import { FiArrowDown, FiDownload } from 'react-icons/fi';
import { useSettings } from '../../context/SettingsContext';
import { getSocialLinks } from '../../utils/socialLinks';
import SocialIcon from '../common/SocialIcon';
import api from '../../api/endpoints';

export default function Hero() {
  const { profile, settings } = useSettings();
  const hero = settings?.hero || {};
  const socialLinks = getSocialLinks(profile);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28"
    >
      {/* Cover/banner image, when set — more visible now (higher opacity +
          contrast boost) while a lighter scrim still keeps hero text fully
          readable over it. */}
      {profile?.coverBanner?.url && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={profile.coverBanner.url}
            alt=""
            className="h-full w-full object-cover"
            style={{ opacity: 0.5, filter: 'contrast(1.15) saturate(1.08)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/45 via-surface/70 to-surface" />
        </div>
      )}

      {/* Ambient blue-purple glow centered behind the hero content — soft
          and blurred rather than a hard-edged "blob", built from the same
          admin-editable theme tokens as everything else. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 38%, var(--color-primary), transparent 65%), radial-gradient(ellipse 45% 40% at 50% 58%, var(--color-secondary), transparent 68%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-primary"
        >
          {profile?.title || hero.headline ? profile?.title : 'Full Stack Engineer'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl font-semibold leading-tight sm:text-7xl"
        >
          {hero.headline || `Hi, I'm ${profile?.name || 'building something great'}.`}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-400"
        >
          {hero.subheadline || profile?.careerObjective}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href={hero.ctaLink || '#projects'}
            className="rounded-full px-6 py-3 font-medium text-surface transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-glow hover:opacity-95"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            {hero.ctaText || 'View my work'}
          </a>
          <a href="#contact" className="glass-card rounded-full px-6 py-3 font-medium transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:shadow-glow">
            Get in touch
          </a>
        </motion.div>

        {/* Social links — sourced entirely from Profile.socialLinks (the
            single source of truth). Whatever the admin adds, edits, removes,
            or reorders there appears here automatically, in that order. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {socialLinks.map(({ platform, href, Icon }) => (
            <a
              key={platform + href}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={platform}
              title={platform}
              className="flex h-11 w-11 items-center justify-center rounded-full glass-card text-lg text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:scale-110 hover:text-primary hover:shadow-glow"
            >
              <SocialIcon icon={Icon} className="text-lg" />
            </a>
          ))}
          <a
            href={api.downloadResumeUrl()}
            download
            className="flex items-center gap-2 rounded-full glass-card px-4 py-2.5 text-sm font-medium text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.04] hover:text-primary hover:shadow-glow"
          >
            <FiDownload /> Resume
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <FiArrowDown size={20} />
      </motion.a>
    </section>
  );
}
