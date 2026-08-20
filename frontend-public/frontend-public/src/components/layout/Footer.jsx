import { useSettings } from '../../context/SettingsContext';
import { getSocialLinks } from '../../utils/socialLinks';
import SocialIcon from '../common/SocialIcon';

export default function Footer() {
  const { settings, profile } = useSettings();

  // Same centralized list as Hero and Contact — nothing platform-specific
  // is hardcoded here.
  const socialLinks = getSocialLinks(profile);

  return (
    <footer className="relative mt-24 border-t border-white/10 px-6 py-10">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), var(--color-secondary), transparent)' }}
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-slate-400 sm:flex-row">
        <p>{settings?.footerText || `© ${new Date().getFullYear()} ${profile?.name || ''}`}</p>

        <div className="flex flex-wrap items-center gap-5">
          {(settings?.footerLinks || []).map((link) => (
            <a key={link.url} href={link.url} className="transition hover:text-white">
              {link.label}
            </a>
          ))}

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map(({ platform, href, Icon }) => (
                <a
                  key={platform + href}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={platform}
                  title={platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:scale-110 hover:bg-white/10 hover:text-primary hover:shadow-glow"
                >
                  <SocialIcon icon={Icon} className="text-[15px]" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
