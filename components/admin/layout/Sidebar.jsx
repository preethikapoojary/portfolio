'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduleRegistry } from '@/lib/adminConfig/moduleRegistry';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#DCD9D1] bg-[#E9E5DC]/35 p-5 md:block">
      <div className="mb-6 flex items-center justify-between border-b border-[#DCD9D1] pb-4">
        <Link href="/admin" className="font-display text-lg font-semibold text-[#22221F]">
          Admin Panel
        </Link>
      </div>
      <nav className="space-y-1">
        {moduleRegistry.map(({ key, label, icon: Icon, path, matchPaths, status }) => {
          const paths = matchPaths || [path];
          const isActive = paths.some((p) =>
            p === '/admin' ? pathname === '/admin' : pathname?.startsWith(p)
          );
          return (
            <Link
              key={key}
              href={path}
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
  );
}
