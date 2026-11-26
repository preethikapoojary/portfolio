'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moduleRegistry } from '@/lib/adminConfig/moduleRegistry';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-admin-panel p-4 md:block">
      <div className="mb-6 flex items-center justify-between px-2 py-2">
        <Link href="/admin" className="font-mono text-sm font-semibold text-admin-primary">
          Portfolio Admin
        </Link>
        <Link href="/" className="text-xs text-admin-muted hover:text-admin-ink">
          View Site ↗
        </Link>
      </div>
      <nav className="space-y-1">
        {moduleRegistry.map(({ key, label, icon: Icon, path, status }) => {
          const isActive = path === '/admin' ? pathname === '/admin' : pathname?.startsWith(path);
          return (
            <Link
              key={key}
              href={path}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-admin-primary/10 font-medium text-admin-primary'
                  : 'text-admin-muted hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={16} />
                {label}
              </span>
              {status === 'phase2' && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-admin-muted">
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
