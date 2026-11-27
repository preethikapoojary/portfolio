'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminSubNavGroups } from '@/lib/adminConfig/moduleRegistry';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const activeGroup = adminSubNavGroups.find((group) =>
    group.matchPaths.some((p) => pathname?.startsWith(p))
  );

  return (
    <div className="admin-shell flex min-h-screen bg-[#F6F4EF] text-[#22221F]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6 sm:p-8">
          {activeGroup && (
            <div className="mb-6 flex flex-wrap gap-2 border-b border-[#DCD9D1] pb-4">
              {activeGroup.tabs.map((tab) => {
                const isTabActive = pathname?.startsWith(tab.path);
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`border px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
                      isTabActive
                        ? 'border-[#22221F] bg-[#22221F] text-[#F6F4EF]'
                        : 'border-[#DCD9D1] text-[#89877F] hover:border-[#22221F] hover:text-[#22221F]'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
