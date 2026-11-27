'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function SectionHeading({
  number,
  eyebrow,
  title,
  actionLabel,
  actionHref,
}) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#DCD9D1] pb-6 sm:flex-row sm:items-end">
      <div>
        {(number || eyebrow) && (
          <p className="mb-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#89877F]">
            {[number, eyebrow].filter(Boolean).join(' — ')}
          </p>
        )}
        <h2 className="font-display text-4xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
          {title}
        </h2>
      </div>

      {actionLabel && actionHref && (
        <Link href={actionHref} className="editorial-link shrink-0 text-[15px]">
          {actionLabel} <FiArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
