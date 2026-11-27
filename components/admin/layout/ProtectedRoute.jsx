'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center bg-[#F6F4EF] text-sm text-[#89877F]">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return children;
}
