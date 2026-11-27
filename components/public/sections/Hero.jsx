'use client';

import Link from 'next/link';
import { FiArrowRight, FiDownload, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';
import { getSocialLinks } from '@/utils/socialLinks';
import api from '@/api/endpoints';

export default function Hero() {
  const { profile, settings, loading, error, retry } = useSettings();
  const hero = settings?.hero || {};
  const socialLinks = getSocialLinks(profile).filter(
    (link) =>
      !link.url?.startsWith('mailto:') &&
      !['gmail', 'email'].includes((link.platform || '').toLowerCase()) &&
      !['gmail', 'email'].includes((link.icon || '').toLowerCase())
  );
  const isHeroLoading = loading || (!profile && !error);

  if (isHeroLoading) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-6 py-16 sm:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <div className="h-4 w-56 animate-pulse bg-[#E9E5DC]" />
            <div className="h-16 w-full max-w-2xl animate-pulse bg-[#E9E5DC]" />
            <div className="h-6 w-4/5 animate-pulse bg-[#E9E5DC]" />
          </div>
          <div className="aspect-[4/5] w-full max-w-md animate-pulse bg-[#E9E5DC] lg:col-span-5" />
        </div>
      </section>
    );
  }

  if (error && !profile) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-6 py-16 sm:px-8">
        <div className="max-w-md border border-[#DCD9D1] bg-[#E9E5DC]/40 p-6">
          <div className="flex items-center gap-2 text-[#22221F]">
            <FiAlertCircle size={18} />
            <p className="text-base font-medium">Unable to load portfolio details</p>
          </div>
          <p className="mt-2 text-sm text-[#89877F]">{error}</p>
          {retry && (
            <button
              type="button"
              onClick={retry}
              className="mt-5 inline-flex items-center gap-2 border border-[#22221F] bg-[#22221F] px-5 py-2.5 text-xs font-medium text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D]"
            >
              <FiRefreshCw size={14} /> Try Again
            </button>
          )}
        </div>
      </section>
    );
  }

  const headline =
    hero.headline || (profile?.name ? `Hi, I'm ${profile.name}.` : "Hi, I'm Preethika.");
  const intro =
    profile?.title ||
    'Information Science & Engineering Student | Aspiring Software Engineer | AI/ML & Full-Stack Enthusiast';

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-6 py-12 sm:px-8">
      <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="font-display text-5xl font-medium leading-[1.06] tracking-tight text-[#22221F] sm:text-6xl lg:text-[4.25rem]">
            {headline}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#89877F] sm:text-xl">
            {intro}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={hero.ctaLink && hero.ctaLink.startsWith('/') ? hero.ctaLink : '/projects'}
              className="inline-flex items-center gap-2.5 border border-[#22221F] bg-[#22221F] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D]"
            >
              {hero.ctaText || 'View Projects'}
              <FiArrowRight size={15} />
            </Link>

            <a
              href={api.downloadResumeUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 border border-[#DCD9D1] bg-transparent px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#22221F] transition-colors hover:border-[#22221F] hover:bg-[#E9E5DC]/50"
            >
              <FiDownload size={15} />
              Download Resume
            </a>
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-7 border-t border-[#DCD9D1] pt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="editorial-link text-xs uppercase tracking-[0.14em]"
                >
                  {link.platform === 'Linkedln' ? 'LinkedIn' : link.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {profile?.profilePhoto?.url && (
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-md border border-[#DCD9D1] bg-[#E9E5DC]/40 p-3 lg:ml-auto lg:mr-0">
              <img
                src={profile.profilePhoto.url}
                alt={profile.name || 'Preethika Poojary'}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
