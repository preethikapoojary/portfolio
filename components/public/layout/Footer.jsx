'use client';

import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { getNonEmailSocialLinks } from '@/utils/socialLinks';

export default function Footer() {
  const { profile } = useSettings();
  const socialLinks = getNonEmailSocialLinks(profile);
  const fullName = profile?.name ? `${profile.name} Poojary` : 'Preethika Poojary';
  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;

  return (
    <footer className="border-t border-[#DCD9D1] bg-[#E9E5DC]/50">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold text-[#22221F]">{fullName}</p>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#89877F]">
              Information Science &amp; Engineering student and aspiring Software Developer.
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#22221F]">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-[#85806D]"
                >
                  {link.platform === 'Linkedln' ? 'LinkedIn' : link.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-[#DCD9D1] pt-6 text-xs text-[#89877F] sm:flex-row sm:items-center">
          <p>© {yearText} {fullName}. All rights reserved.</p>
          <Link href="/admin" className="hover:text-[#22221F]">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
