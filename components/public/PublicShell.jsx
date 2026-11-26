'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import Navbar from '@/components/public/layout/Navbar';
import Footer from '@/components/public/layout/Footer';
import LoadingScreen from '@/components/public/layout/LoadingScreen';
import ScrollProgressBar from '@/components/public/common/ScrollProgressBar';
import BackToTop from '@/components/public/common/BackToTop';
import StarfieldBackground from '@/components/public/common/StarfieldBackground';

function PublicContent({ children }) {
  const { ready } = useSettings();
  if (!ready) return <LoadingScreen />;

  return (
    <>
      <StarfieldBackground />
      <ScrollProgressBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
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
