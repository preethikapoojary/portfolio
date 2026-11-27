'use client';

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-6xl flex-col items-start justify-center px-6 py-20 sm:px-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#89877F]">404</p>
      <h1 className="mt-2 font-display text-4xl font-medium text-[#22221F] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-[#89877F]">
        The page you requested does not exist or has been moved.
      </p>
      <Link href="/" className="editorial-link mt-8">
        <FiArrowLeft size={14} /> Return Home
      </Link>
    </div>
  );
}
