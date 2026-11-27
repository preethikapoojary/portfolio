'use client';

import Link from 'next/link';
import { FiArrowUp } from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';
import { getSocialLinks } from '@/utils/socialLinks';

export default function Footer() {
  const { profile } = useSettings();
  const socialLinks = getSocialLinks(profile);
  const fullName = profile?.name ? `${profile.name} Poojary` : 'Preethika Poojary';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#DCD9D1] bg-[#E9E5DC]/50">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-[#22221F]">{fullName}</p>
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#89877F]">
              Information Science &amp; Engineering student and aspiring Software Developer.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium text-[#22221F]">
            <Link href="/" className="hover:text-[#85806D]">Home</Link>
            <Link href="/about" className="hover:text-[#85806D]">About</Link>
            <Link href="/projects" className="hover:text-[#85806D]">Projects</Link>
            <Link href="/experience" className="hover:text-[#85806D]">Experience</Link>
            <Link href="/certificates" className="hover:text-[#85806D]">Certificates</Link>
            <Link href="/contact" className="hover:text-[#85806D]">Contact</Link>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#22221F]">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="hover:text-[#85806D]"
                >
                  {link.platform === 'Linkedln' ? 'LinkedIn' : link.platform}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#89877F] transition-colors hover:text-[#22221F]"
            >
              Back to top <FiArrowUp size={12} />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-[#DCD9D1] pt-6 text-xs text-[#89877F] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-[#22221F]">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
