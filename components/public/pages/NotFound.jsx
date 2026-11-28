'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiCompass, FiCornerDownLeft, FiTerminal } from 'react-icons/fi';

export default function NotFound() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');
  const [origin, setOrigin] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (isPaused || countdown <= 0) {
      if (countdown === 0) {
        router.push('/');
      }
      return undefined;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, router]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
      <p className="font-display text-7xl font-medium leading-none tracking-tight text-[#22221F] sm:text-8xl">
        404
      </p>

      <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-[#22221F] sm:text-5xl">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#89877F] sm:text-base">
        The endpoint you requested does not exist, was moved, or could not be found. Let&apos;s get you back to the portfolio.
      </p>

      {/* Diagnostic Terminal */}
      <div
        className="mt-8 w-full max-w-xl overflow-hidden border border-[#DCD9D1] bg-[#1C1C1A] text-left text-[#F6F4EF] shadow-lg"
        aria-label="Diagnostic Terminal"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#252522] px-4 py-2.5 text-xs text-[#A3A199]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="font-mono text-[11px]">bash · diagnostic</span>
          <FiTerminal size={13} />
        </div>

        <div className="space-y-1.5 px-4 py-4 font-mono text-xs leading-relaxed sm:text-[13px]">
          <p className="break-all text-[#F6F4EF]">
            <span className="mr-2 text-[#85806D]">$</span>
            curl -I {origin || 'https://preethika-poojary.vercel.app'}
            {currentPath || '/unknown-endpoint'}
          </p>
          <p className="text-red-400">&gt; HTTP/2 404 NOT_FOUND</p>
          <p className="text-amber-300">&gt; error: ERR_ENDPOINT_UNRESOLVED</p>
          <p className="text-[#A3A199]">
            &gt; suggestion: Return to Home Page or navigate via top navigation
          </p>
        </div>
      </div>

      {/* Primary Action */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 border border-[#22221F] bg-[#22221F] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#F6F4EF] transition-colors hover:border-[#85806D] hover:bg-[#85806D]"
        >
          <FiCompass size={16} />
          <span>Return to Home Page</span>
          <FiCornerDownLeft size={14} />
        </Link>
      </div>

      {/* Auto-redirect countdown */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#89877F]">
        {countdown > 0 ? (
          <>
            <span>
              Auto-returning to homepage in <strong className="text-[#22221F]">{countdown}s</strong>
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="font-medium text-[#22221F] underline decoration-[#85806D] underline-offset-4 hover:text-[#85806D]"
            >
              {isPaused ? 'Resume timer' : 'Pause timer'}
            </button>
          </>
        ) : (
          <span>Redirecting to homepage…</span>
        )}
      </div>
    </div>
  );
}
