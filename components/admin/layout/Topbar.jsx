'use client';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '@/context/AdminAuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Topbar() {
  const { admin, logout } = useAuth();
  const { mode, toggle } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#DCD9D1] bg-[#F6F4EF] px-6">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-[#89877F]">
        Administration
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggle}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCD9D1] text-[#89877F] transition-colors hover:border-[#22221F] hover:text-[#22221F]"
          aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={mode === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {mode === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
        </button>
        <span className="hidden text-xs font-medium text-[#89877F] sm:inline">
          {admin?.email || admin?.name}
        </span>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-[#DCD9D1] px-3 py-1.5 text-xs font-medium text-[#22221F] transition-colors hover:border-[#22221F] hover:bg-[#E9E5DC]/40"
        >
          View Site <span aria-hidden="true">↗</span>
        </a>
        <button
          type="button"
          onClick={logout}
          className="p-2 text-[#89877F] transition-colors hover:text-[#22221F]"
          aria-label="Log out"
          title="Log out"
        >
          <FiLogOut size={16} />
        </button>
      </div>
    </header>
  );
}
