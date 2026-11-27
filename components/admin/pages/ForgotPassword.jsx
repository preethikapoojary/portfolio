'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || 'Unable to send magic recovery link.');
      }
      setSent(true);
    } catch (err) {
      setError(err?.message || 'Unable to send magic recovery link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell flex min-h-screen flex-col items-center justify-center bg-[#F6F4EF] px-6 text-[#22221F]">
      <div className="w-full max-w-md">
        <Link
          href="/admin/login"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#89877F] transition-colors hover:text-[#22221F]"
        >
          <FiArrowLeft size={13} /> Back to Sign In
        </Link>

        <div className="border border-[#DCD9D1] bg-[#E9E5DC]/30 p-8 sm:p-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Account Recovery
          </p>
          <h1 className="mb-3 font-display text-3xl font-medium tracking-tight text-[#22221F]">
            Forgot Password
          </h1>
          <p className="mb-7 text-sm leading-relaxed text-[#89877F]">
            Enter your admin email address and we&apos;ll send a Supabase magic link to reset your password.
          </p>

          {sent ? (
            <div className="border border-[#DCD9D1] bg-[#F6F4EF] p-5">
              <div className="flex items-center gap-2 text-[#22221F]">
                <FiCheck size={16} />
                <p className="text-sm font-medium">Magic link sent</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#89877F]">
                Check <span className="font-medium text-[#22221F]">{email}</span> and click the recovery link to set a new password.
              </p>
              <Link
                href="/admin/login"
                className="mt-5 inline-block text-xs font-medium uppercase tracking-[0.12em] text-[#22221F] underline underline-offset-4"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="label" htmlFor="reset-email">
                Admin Email
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input mb-6"
              />

              {error && <p className="mb-4 text-xs text-red-700">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Sending magic link…' : 'Send Magic Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
