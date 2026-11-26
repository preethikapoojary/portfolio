'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="gradient-text font-display text-7xl font-bold">404</p>
      <p className="mt-4 text-slate-400">This page doesn't exist — the way is quiet, not broken.</p>
      <Link href="/" className="mt-6 rounded-full glass-card px-6 py-2.5 text-sm">
        Back home
      </Link>
    </div>
  );
}
