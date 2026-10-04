import { motion } from 'framer-motion';
import { FiArrowDown, FiDownload, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useSettings } from '../../context/SettingsContext';
import { getSocialLinks } from '../../utils/socialLinks';
import SocialIcon from '../common/SocialIcon';
import api from '../../api/endpoints';

export default function Hero() {
  const { profile, settings, loading, error, retry } = useSettings();
  const hero = settings?.hero || {};
  const socialLinks = getSocialLinks(profile);

  const isHeroLoading = loading || (!profile && !error);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28"
    >
      {/* Cover/banner image, when set */}
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

      {/* Ambient blue-purple glow centered behind the hero content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 38%, var(--color-primary), transparent 65%), radial-gradient(ellipse 45% 40% at 50% 58%, var(--color-secondary), transparent 68%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {isHeroLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 h-4 w-44 animate-pulse rounded bg-white/10" />
            <div className="mb-3 h-12 w-3/4 max-w-xl animate-pulse rounded-lg bg-white/10 sm:h-16" />
            <div className="mt-6 h-6 w-2/3 max-w-md animate-pulse rounded bg-white/10" />
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-12 w-36 animate-pulse rounded-full bg-white/10" />
              <div className="h-12 w-36 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ) : error && !profile ? (
          <div className="glass-card mx-auto max-w-md p-8 text-center">
            <FiAlertCircle className="mx-auto mb-3 text-3xl text-amber-400" />
            <p className="font-medium text-slate-200">Unable to load portfolio details</p>
            <p className="mt-1 text-sm text-slate-400">{error}</p>
            {retry && (
              <button
                onClick={retry}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-surface transition duration-300 hover:scale-[1.04]"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                <FiRefreshCw /> Try Again
              </button>
            )}
          </div>
        ) : (
          <>
            {profile?.title && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-primary"
              >
                {profile.title}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl font-semibold leading-tight sm:text-7xl"
            >
              {hero.headline || (profile?.name ? `Hi, I'm ${profile.name}.` : '')}
            </motion.h1>

            {(hero.subheadline || profile?.careerObjective) && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-6 max-w-xl text-lg text-slate-400"
              >
                {hero.subheadline || profile?.careerObjective}
              </motion.p>
            )}

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
          </>
        )}
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
