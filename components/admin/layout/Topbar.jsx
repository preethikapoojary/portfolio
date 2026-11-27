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
    <header className="flex h-16 items-center justify-between border-b border-[#DCD9D1] bg-[#F6F4EF] px-6">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-[#89877F]">
        Administration
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/messages')}
          className="relative p-2 text-[#89877F] transition-colors hover:text-[#22221F]"
          aria-label="Messages"
        >
          <FiMessageSquare size={16} />
          {summary.unreadMessages > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#22221F] text-[10px] text-[#F6F4EF]">
              {summary.unreadMessages}
            </span>
          )}
        </button>
        <button
          className="relative p-2 text-[#89877F] transition-colors hover:text-[#22221F]"
          aria-label="Notifications"
        >
          <FiBell size={16} />
          {totalBadge > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#85806D] text-[10px] text-[#F6F4EF]">
              {totalBadge}
            </span>
          )}
        </button>
        <div className="h-5 w-px bg-[#DCD9D1]" />
        <span className="text-xs font-medium text-[#22221F]">{admin?.name || admin?.email}</span>
        <button
          onClick={logout}
          className="p-2 text-[#89877F] transition-colors hover:text-[#22221F]"
          aria-label="Log out"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </header>
  );
}
