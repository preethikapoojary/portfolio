'use client';
import { usePathname } from 'next/navigation';
import { moduleRegistry } from '@/lib/adminConfig/moduleRegistry';

export default function ComingSoon() {
  const pathname = usePathname();
  const mod = moduleRegistry.find((m) => m.path === pathname);

  return (
    <div className="card max-w-lg">
      <h1 className="mb-2 text-xl font-semibold">{mod?.label || 'Module'}</h1>
      <p className="text-sm text-admin-muted">
        This module is coming soon.
      </p>
    </div>
  );
}
