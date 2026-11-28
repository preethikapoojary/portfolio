'use client';

import { FiGithub, FiLinkedin } from 'react-icons/fi';

/**
 * Renders only admin-verified LinkedIn / GitHub profile icon links, with a
 * desktop hover tooltip ("Verified LinkedIn Profile" / "Verified GitHub Profile").
 */
export default function VerifiedProfileLinks({ item }) {
  const showLinkedin = Boolean(item?.linkedinVerified && item?.linkedinUrl);
  const showGithub = Boolean(item?.githubVerified && item?.githubUrl);

  if (!showLinkedin && !showGithub) return null;

  return (
    <div className="flex items-center gap-2.5 text-[#89877F]">
      {showLinkedin && (
        <div className="group relative flex items-center">
          <a
            href={item.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.name} — Verified LinkedIn Profile`}
            className="transition-colors hover:text-[#22221F]"
          >
            <FiLinkedin size={14} />
          </a>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#22221F] px-3 py-1.5 text-[11px] font-medium text-[#F6F4EF] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 lg:block"
          >
            Verified LinkedIn Profile
          </span>
        </div>
      )}

      {showGithub && (
        <div className="group relative flex items-center">
          <a
            href={item.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.name} — Verified GitHub Profile`}
            className="transition-colors hover:text-[#22221F]"
          >
            <FiGithub size={14} />
          </a>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#22221F] px-3 py-1.5 text-[11px] font-medium text-[#F6F4EF] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 lg:block"
          >
            Verified GitHub Profile
          </span>
        </div>
      )}
    </div>
  );
}
