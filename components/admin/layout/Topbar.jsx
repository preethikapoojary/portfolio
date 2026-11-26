'use client';
import { useEffect, useState } from 'react';
import { FiBell, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AdminAuthContext';
import { notificationsApi } from '@/lib/adminApi/endpoints';

export default function Topbar() {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState({
    unreadMessages: 0,
    pendingTestimonials: 0,
    unreadSystem: 0,
  });

  useEffect(() => {
    const fetchSummary = () =>
      notificationsApi
        .summary()
        .then((res) => setSummary(res.data || {}))
        .catch(() => {});
    fetchSummary();
    const interval = setInterval(fetchSummary, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalBadge =
    (summary.unreadMessages || 0) +
    (summary.pendingTestimonials || 0) +
    (summary.unreadSystem || 0);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-admin-panel px-6 py-3">
      <div />
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/messages')}
          className="relative rounded-lg p-2 text-admin-muted hover:bg-slate-100"
          aria-label="Messages"
        >
          <FiMessageSquare />
          {summary.unreadMessages > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {summary.unreadMessages}
            </span>
          )}
        </button>
        <button
          className="relative rounded-lg p-2 text-admin-muted hover:bg-slate-100"
          aria-label="Notifications"
        >
          <FiBell />
          {totalBadge > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-admin-primary text-[10px] text-white">
              {totalBadge}
            </span>
          )}
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <span className="text-sm text-admin-muted">{admin?.name || admin?.email}</span>
        <button
          onClick={logout}
          className="rounded-lg p-2 text-admin-muted hover:bg-slate-100"
          aria-label="Log out"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}
