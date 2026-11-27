'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/context/AdminAuthContext';

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [authLoading, isAuthenticated, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.replace('/admin');
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell flex min-h-screen flex-col items-center justify-center bg-[#F6F4EF] px-6 text-[#22221F]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#89877F] transition-colors hover:text-[#22221F]"
        >
          <FiArrowLeft size={13} /> Back to Portfolio
        </Link>

        <form onSubmit={submit} className="border border-[#DCD9D1] bg-[#E9E5DC]/30 p-8 sm:p-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#89877F]">
            Portfolio Administration
          </p>
          <h1 className="mb-8 font-display text-3xl font-medium tracking-tight text-[#22221F]">
            Sign In
          </h1>

          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input mb-5"
          />

          <div className="mb-1.5 flex items-center justify-between">
            <label className="label !mb-0" htmlFor="password">
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-xs font-medium text-[#89877F] underline decoration-[#DCD9D1] underline-offset-4 transition-colors hover:text-[#22221F]"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input mb-6"
          />

          {error && <p className="mb-4 text-xs text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
