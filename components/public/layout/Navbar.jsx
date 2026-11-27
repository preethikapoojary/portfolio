'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/api/endpoints';

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useSettings();
  const { mode, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasBlogs, setHasBlogs] = useState(false);
  const [activeKey, setActiveKey] = useState('home');
  const headerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const menuBtnRef = useRef(null);

  const isHome = pathname === '/';

  useEffect(() => {
    api
      .getBlogPosts()
      .then((posts) => setHasBlogs(Array.isArray(posts) && posts.length > 0))
      .catch(() => setHasBlogs(false));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Scroll-spy for homepage sections
  useEffect(() => {
    if (!isHome) return undefined;

    const sectionIds = [
      'about',
      'projects',
      'experience',
      'certificates',
      ...(hasBlogs ? ['blog'] : []),
      'contact',
    ];

    const onScrollSpy = () => {
      if (window.scrollY < 160) {
        setActiveKey('home');
        return;
      }
      const offset = 140;
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset) {
            current = id;
          }
        }
      }
      setActiveKey(current);
    };

    onScrollSpy();
    window.addEventListener('scroll', onScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', onScrollSpy);
  }, [isHome, hasBlogs]);

  useEffect(() => {
    const onPointerOutside = (e) => {
      if (!mobileOpen) return;
      const inHeader = headerRef.current?.contains(e.target);
      const inMenu = mobileNavRef.current?.contains(e.target);
      if (!inHeader && !inMenu) {
        setMobileOpen(false);
      }
    };

    const onScroll = () => {
      if (mobileOpen) {
        setMobileOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggle();
        return;
      }
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        menuBtnRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerOutside);
    document.addEventListener('touchstart', onPointerOutside, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerOutside);
      document.removeEventListener('touchstart', onPointerOutside);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen, toggle]);

  const homeNavLinks = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About', href: '#about' },
    { key: 'projects', label: 'Projects', href: '#projects' },
    { key: 'experience', label: 'Experience', href: '#experience' },
    { key: 'certificates', label: 'Certificates', href: '#certificates' },
    ...(hasBlogs ? [{ key: 'blog', label: 'Blog', href: '#blog' }] : []),
    { key: 'contact', label: 'Contact', href: '#contact' },
  ];

  // Contextual links for sub-pages:
  // - Top-level sub-pages (/about, /projects, etc.): Home + theme toggle
  // - Detail pages (/projects/[slug], /experience/[id], /blog/[slug]): Home + parent section + theme toggle
  const getSubPageLinks = () => {
    const links = [{ key: 'home', label: 'Home', href: '/' }];
    if (pathname?.startsWith('/projects/') && pathname !== '/projects') {
      links.push({ key: 'projects', label: 'Projects', href: '/projects' });
    } else if (pathname?.startsWith('/experience/') && pathname !== '/experience') {
      links.push({ key: 'experience', label: 'Experience', href: '/experience' });
    } else if (pathname?.startsWith('/blog/') && pathname !== '/blog') {
      links.push({ key: 'blog', label: 'Blog', href: '/blog' });
    }
    return links;
  };

  const navLinks = isHome ? homeNavLinks : getSubPageLinks();

  const isLinkActive = (key) => {
    if (isHome) return activeKey === key;
    if (key === 'home') return false;
    return pathname === `/${key}` || pathname?.startsWith(`/${key}/`);
  };

  const handleHomeClick = (e) => {
    setMobileOpen(false);
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveKey('home');
    }
  };

  const displayName = profile?.name ? `${profile.name} Poojary` : 'Preethika Poojary';

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-[#DCD9D1] bg-[#F6F4EF]/95 backdrop-blur-sm transition-colors duration-200"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          onClick={handleHomeClick}
          className="font-display text-xl font-semibold tracking-tight text-[#22221F] transition-colors hover:text-[#85806D]"
        >
          {displayName}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((item) => {
            const active = isLinkActive(item.key);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={item.key === 'home' ? handleHomeClick : undefined}
                className={`relative py-1 text-[13px] font-medium tracking-wide transition-colors ${
                  active ? 'text-[#22221F]' : 'text-[#89877F] hover:text-[#22221F]'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-[1.5px] bg-[#85806D]" />
                )}
              </Link>
            );
          })}

          <div className="group relative">
            <button
              type="button"
              onClick={toggle}
              aria-label={mode === 'dark' ? 'Switch to light theme (Ctrl+Alt+L)' : 'Switch to dark theme (Ctrl+Alt+L)'}
              className="p-1.5 text-[#89877F] transition-colors hover:text-[#22221F]"
            >
              {mode === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap border border-[#DCD9D1] bg-[#F6F4EF] px-2.5 py-1 text-[11px] font-medium text-[#22221F] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {mode === 'dark' ? 'Light mode' : 'Dark mode'} · Ctrl+Alt+L
            </span>
          </div>
        </nav>

        {/* Smooth 3-Line to X Animated Hamburger Button */}
        <button
          ref={menuBtnRef}
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-floating-nav"
          className="relative z-50 flex h-9 w-9 flex-col items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#85806D] md:hidden"
        >
          <span
            className={`block h-[1.5px] w-5 bg-current text-[#22221F] transition-all duration-300 ease-in-out ${
              mobileOpen ? 'translate-y-[1.5px] rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            className={`block h-[1.5px] w-5 bg-current text-[#22221F] transition-all duration-300 ease-in-out ${
              mobileOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-[1.5px] w-5 bg-current text-[#22221F] transition-all duration-300 ease-in-out ${
              mobileOpen ? '-translate-y-[1.5px] -rotate-45' : 'translate-y-1.5'
            }`}
          />
        </button>
      </div>

      {/* Compact Floating Dropdown Menu */}
      <nav
        ref={mobileNavRef}
        id="mobile-floating-nav"
        aria-label="Mobile"
        aria-hidden={!mobileOpen}
        className={`fixed right-4 top-[4.5rem] z-50 w-56 max-w-[calc(100vw-2rem)] rounded-[22px] border border-[#DCD9D1] bg-[#F6F4EF] px-5 py-6 shadow-[0_14px_40px_rgba(34,34,31,0.12)] transition-all duration-200 ease-out md:hidden ${
          mobileOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {navLinks.map((item) => {
            const active = isLinkActive(item.key);
            return (
              <Link
                key={item.key}
                href={item.href}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={
                  item.key === 'home'
                    ? handleHomeClick
                    : () => setMobileOpen(false)
                }
                className={`py-0.5 text-[15px] font-medium tracking-wide transition-colors ${
                  active
                    ? 'font-semibold text-[#22221F] underline decoration-[#85806D] decoration-1 underline-offset-4'
                    : 'text-[#89877F] hover:text-[#22221F]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            tabIndex={mobileOpen ? 0 : -1}
            onClick={toggle}
            aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="mt-1 p-2 text-[#22221F] transition-colors hover:text-[#85806D]"
          >
            {mode === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
