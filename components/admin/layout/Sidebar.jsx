'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import { moduleRegistry } from '@/lib/adminConfig/moduleRegistry';

export default function Sidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[#DCD9D1] bg-[#F6F4EF] p-5 transition-transform duration-200 md:static md:translate-x-0 md:bg-[#E9E5DC]/35 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between border-b border-[#DCD9D1] pb-4">
          <Link
            href="/admin"
            onClick={onClose}
            className="font-display text-lg font-semibold text-[#22221F]"
          >
            Admin Panel
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#89877F] transition-colors hover:text-[#22221F] md:hidden"
            aria-label="Close navigation menu"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {moduleRegistry.map(({ key, label, icon: Icon, path, matchPaths, status }) => {
            const paths = matchPaths || [path];
            const isActive = paths.some((p) =>
              p === '/admin' ? pathname === '/admin' : pathname?.startsWith(p)
            );
            return (
              <Link
                key={key}
                href={path}
                onClick={onClose}
                className={`flex items-center justify-between border-l-2 px-3 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'border-[#22221F] bg-[#E9E5DC]/60 font-medium text-[#22221F]'
                    : 'border-transparent text-[#89877F] hover:bg-[#E9E5DC]/40 hover:text-[#22221F]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={15} />
                  {label}
                </span>
                {status === 'phase2' && (
                  <span className="border border-[#DCD9D1] px-1.5 py-0.5 text-[10px] text-[#89877F]">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
