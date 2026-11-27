'use client';
import { useEffect } from 'react';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '@/context/AdminAuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Topbar() {
  const { admin, logout } = useAuth();
  const { mode, toggle } = useTheme();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#DCD9D1] bg-[#F6F4EF] px-6">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-[#89877F]">
        Administration
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="group relative">
          <button
            type="button"
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCD9D1] text-[#89877F] transition-colors hover:border-[#22221F] hover:text-[#22221F]"
            aria-label={mode === 'dark' ? 'Switch to light theme (Ctrl+Alt+L)' : 'Switch to dark theme (Ctrl+Alt+L)'}
          >
            {mode === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap border border-[#DCD9D1] bg-[#F6F4EF] px-2.5 py-1 text-[11px] font-medium text-[#22221F] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
          >
            {mode === 'dark' ? 'Light mode' : 'Dark mode'} · Ctrl+Alt+L
          </span>
        </div>
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
