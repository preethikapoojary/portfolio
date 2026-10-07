import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import SocialIcon from '../common/SocialIcon';
import { useSettings } from '../../context/SettingsContext';
import { getSocialLinks } from '../../utils/socialLinks';

export default function Contact() {
  const { profile } = useSettings();
  const socialLinks = getSocialLinks(profile);

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading eyebrow="Contact" title="Get in Touch" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-10 text-center relative overflow-hidden"
      >
        {/* Soft background radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 blur-2xl"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, var(--color-primary), transparent 70%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-2xl text-primary">
            <FiMail />
          </div>

          <h3 className="font-display text-2xl font-semibold sm:text-3xl text-slate-100">
            Let&apos;s build something great together
          </h3>
          <p className="mt-3 text-base text-slate-400">
            Have a project in mind, a job opportunity, or just want to connect? Send me a message and I&apos;ll get back to you promptly.
          </p>

          {profile?.phone && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <span>📞 {profile.phone}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-medium text-surface transition duration-300 hover:scale-[1.04] hover:shadow-glow"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              Contact Me <FiArrowRight />
            </Link>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map(({ platform, href, Icon }) => (
                <a
                  key={platform + href}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={platform}
                  className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:scale-110 hover:text-primary hover:shadow-glow"
                >
                  <SocialIcon icon={Icon} className="text-base" />
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
