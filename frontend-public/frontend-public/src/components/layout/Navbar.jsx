import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

const NAV_ORDER = ['about', 'projects', 'experience', 'certificates', 'blog', 'contact'];

const DEFAULT_LABELS = {
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  certificates: 'Certificates',
  blog: 'Blog',
  contact: 'Contact',
};

export default function Navbar() {
  const { mode, toggle } = useTheme();
  const { settings, sections } = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeKey, setActiveKey] = useState('home');
  const location = useLocation();

  const isHome = location.pathname === '/';

  // Navigation items matching user requirements:
  // About, Projects, Experience, Certificates, Blog, Contact
  const navSections = NAV_ORDER.map((key) => {
    const found = (sections || []).find((s) => s.key === key);
    return {
      key,
      label: found?.label || DEFAULT_LABELS[key],
      isVisible: found ? found.isVisible : true,
    };
  }).filter((s) => s.isVisible);

  // Monitor scroll distance to apply elevated glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Scroll-spy: highlights whichever section is currently active
  useEffect(() => {
    if (!isHome) return undefined;

    const keys = ['home', ...navSections.map((s) => s.key)];
    const elements = keys.map((key) => document.getElementById(key)).filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveKey(topMost.target.id);
        }
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (window.scrollY < 120) {
        setActiveKey('home');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome, navSections.map((s) => s.key).join(',')]);

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveKey('home');
      window.history.pushState(null, '', '/');
    }
    setOpen(false);
  };

  const handleNavClick = (e, key) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(key);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${key}`);
        setActiveKey(key);
      }
    }
    setOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full px-4 sm:px-6 transition-all duration-300">
      <nav
        className={`glass-card mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 sm:py-3 transition-all duration-300 ${
          scrolled
            ? 'mt-2.5 sm:mt-3 shadow-xl bg-surface/85 backdrop-blur-xl border border-white/10'
            : 'mt-3.5 sm:mt-4 shadow-glass'
        }`}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 font-display text-base sm:text-lg font-semibold tracking-tight transition hover:opacity-90"
        >
          {settings?.logo?.url ? (
            <img
              src={settings.logo.url}
              alt="Logo"
              className="h-7 w-7 rounded-full object-cover border border-white/10"
            />
          ) : (
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-surface shadow-glow"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              {settings?.hero?.headline?.slice(0, 1) || 'P'}
            </span>
          )}
          <span className="text-slate-100">{settings?.seo?.metaTitle || 'Portfolio'}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 text-sm text-slate-300 md:flex">
          {navSections.map((s) => {
            const isActive = isHome && activeKey === s.key;
            return (
              <li key={s.key}>
                {isHome ? (
                  <a
                    href={`#${s.key}`}
                    onClick={(e) => handleNavClick(e, s.key)}
                    className={`relative rounded-full px-3.5 py-1.5 transition-colors duration-200 ${
                      isActive ? 'text-white font-medium' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                          opacity: 0.22,
                          boxShadow: '0 0 16px -1px var(--color-primary)',
                        }}
                      />
                    )}
                    {s.label}
                  </a>
                ) : (
                  <Link
                    to={`/#${s.key}`}
                    onClick={() => setOpen(false)}
                    className="rounded-full px-3.5 py-1.5 text-slate-300 transition-colors hover:text-white"
                  >
                    {s.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Actions (Theme toggle & Mobile menu button) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle dark/light mode"
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {mode === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Toggle menu"
          >
            {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass-card mx-auto mt-2 max-w-6xl rounded-2xl p-4 text-sm md:hidden border border-white/10 shadow-2xl bg-surface/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={handleLogoClick}
                className={`rounded-xl px-4 py-2.5 transition-colors ${
                  isHome && activeKey === 'home'
                    ? 'bg-white/10 font-medium text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                Home
              </Link>

              {navSections.map((s) => {
                const isActive = isHome && activeKey === s.key;
                return isHome ? (
                  <a
                    key={s.key}
                    href={`#${s.key}`}
                    onClick={(e) => handleNavClick(e, s.key)}
                    className={`rounded-xl px-4 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-white/10 font-medium text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </a>
                ) : (
                  <Link
                    key={s.key}
                    to={`/#${s.key}`}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
