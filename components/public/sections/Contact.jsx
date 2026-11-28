'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';
import { buildMailtoHref, getContactEmail, getNonEmailSocialLinks } from '@/utils/socialLinks';

export default function Contact() {
  const { profile } = useSettings();
  const socialLinks = getNonEmailSocialLinks(profile);
  const contactEmail = getContactEmail(profile);

  return (
    <section
      id="contact"
      className="flex flex-col justify-center border-t border-[#DCD9D1] py-20 lg:min-h-[calc(100vh-14rem)] lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#89877F]">
          Get in Touch
        </p>

        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-[#22221F] sm:text-5xl lg:text-6xl">
              Have an interesting idea? Let&apos;s build something meaningful.
            </h2>

            {contactEmail && (
              <a
                href={buildMailtoHref(contactEmail)}
                className="mt-8 inline-block border-b border-[#DCD9D1] pb-1 text-lg text-[#89877F] transition-colors hover:border-[#22221F] hover:text-[#22221F]"
              >
                {contactEmail}
              </a>
            )}
          </div>

          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:items-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 border border-[#22221F] bg-[#22221F] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D]"
            >
              Contact Me <FiArrowRight size={15} />
            </Link>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-6 text-sm font-medium text-[#89877F]">
                {socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="transition-colors hover:text-[#22221F]"
                  >
                    {link.platform === 'Linkedln' ? 'LinkedIn' : link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
