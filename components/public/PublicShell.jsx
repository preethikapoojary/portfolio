'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import Navbar from '@/components/public/layout/Navbar';
import Footer from '@/components/public/layout/Footer';
import LoadingScreen from '@/components/public/layout/LoadingScreen';

function PublicContent({ children }) {
  const { ready } = useSettings();
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  if (!ready) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F4EF] text-[#22221F] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <PublicContent>{children}</PublicContent>
      </SettingsProvider>
    </ThemeProvider>
  );
}
