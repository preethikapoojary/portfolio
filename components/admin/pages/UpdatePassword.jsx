'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyAdminRecoverySession = async (session) => {
      if (!session?.access_token) {
        setHasSession(false);
        setReady(true);
        return;
      }
      try {
        const res = await fetch('/api/admin/auth/update-password', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          setHasSession(false);
        } else {
          setHasSession(true);
        }
      } catch {
        setHasSession(false);
      } finally {
        setReady(true);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyAdminRecoverySession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        verifyAdminRecoverySession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Recovery link has expired or is invalid.');
      }
      const res = await fetch('/api/admin/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || 'Unable to update password.');
      }
      setUpdated(true);
      setTimeout(() => {
        router.replace('/admin');
      }, 1500);
    } catch (err) {
      setError(err?.message || 'Unable to update password.');
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
            Security
          </p>
          <h1 className="mb-3 font-display text-3xl font-medium tracking-tight text-[#22221F]">
            Update Password
          </h1>

          {!ready ? (
            <p className="text-sm text-[#89877F]">Verifying recovery link…</p>
          ) : updated ? (
            <div className="border border-[#DCD9D1] bg-[#F6F4EF] p-5">
              <div className="flex items-center gap-2 text-[#22221F]">
                <FiCheck size={16} />
                <p className="text-sm font-medium">Password updated</p>
              </div>
              <p className="mt-2 text-xs text-[#89877F]">
                Redirecting to the admin dashboard…
              </p>
            </div>
          ) : !hasSession ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-[#89877F]">
                This recovery link is invalid or has expired. Please request a new magic link.
              </p>
              <Link href="/admin/forgot-password" className="btn-primary inline-block text-center">
                Request New Magic Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="mb-6 text-sm text-[#89877F]">
                Enter your new administrator password below.
              </p>

              <label className="label" htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mb-5"
              />

              <label className="label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input mb-6"
              />

              {error && <p className="mb-4 text-xs text-red-700">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
