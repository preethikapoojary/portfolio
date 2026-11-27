'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackSectionView } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return undefined;
    const timer = setTimeout(() => {
      trackPageView(pathname, document.title);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/' || typeof IntersectionObserver === 'undefined') return undefined;

    const activeStart = new Map();
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (sections.length === 0) return undefined;

    const flushAll = () => {
      const now = Date.now();
      activeStart.forEach((startedAt, id) => {
        const elapsed = now - startedAt;
        if (elapsed >= 1000) {
          trackSectionView(id, elapsed, 100);
        }
      });
      activeStart.clear();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          if (entry.isIntersecting) {
            if (!activeStart.has(id)) activeStart.set(id, now);
          } else if (activeStart.has(id)) {
            const elapsed = now - activeStart.get(id);
            activeStart.delete(id);
            trackSectionView(id, elapsed, 100);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((el) => observer.observe(el));
    window.addEventListener('beforeunload', flushAll);

    return () => {
      flushAll();
      observer.disconnect();
      window.removeEventListener('beforeunload', flushAll);
    };
  }, [pathname]);

  return null;
}
