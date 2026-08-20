import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

const SECTION_LABELS = {
  home: 'Home',
  about: 'About',
  projects: 'Projects',
  experience: 'Experience',
  skills: 'Skills',
  certificates: 'Certificates',
  blog: 'Blog',
  contact: 'Contact',
};

export default function Navbar() {
  const { mode, toggle } = useTheme();
  const { settings, sections } = useSettings();
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('home');
  const location = useLocation();

  // Only show a curated subset of sections in the primary nav, in DB order,
  // filtered to those actually visible — reordering/hiding in the dashboard
  // updates this instantly, no code change.
  const navSections = sections.filter(
    (s) => s.isVisible && SECTION_LABELS[s.key] && s.key !== 'home'
  );

  const isHome = location.pathname === '/';

  // Scroll-spy: highlights whichever section is currently near the top of
  // the viewport. Only meaningful on the single-page home route, where all
  // section ids actually exist in the DOM.
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
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, navSections.map((s) => s.key).join(',')]);

  return (
    <header className="fixed top-0 z-40 w-full">
      <nav className="glass-card mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-xl2 px-5 py-3 sm:mx-4 lg:mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          {settings?.logo?.url ? (
            <img src={settings.logo.url} alt="Logo" className="h-7 w-7 rounded" />
          ) : (
            <span className="gradient-text">{settings?.hero?.headline?.slice(0, 1) || 'P'}</span>
          )}
          <span>{settings?.seo?.metaTitle || 'Portfolio'}</span>
        </Link>

        <ul className="hidden items-center gap-1 text-sm text-slate-300 md:flex">
          {navSections.map((s) => {
            const isActive = isHome && activeKey === s.key;
            return (
              <li key={s.key}>
                {isHome ? (
                  <a
                    href={`#${s.key}`}
                    className={`relative rounded-full px-3.5 py-1.5 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                          opacity: 0.18,
                          boxShadow: '0 0 18px -2px var(--color-primary)',
                        }}
                      />
                    )}
                    {SECTION_LABELS[s.key]}
                  </a>
                ) : (
                  <Link to={`/#${s.key}`} className="rounded-full px-3.5 py-1.5 transition-colors hover:text-white">
                    {SECTION_LABELS[s.key]}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle dark/light mode"
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {mode === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-slate-300 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-card mx-4 mt-2 flex flex-col gap-3 rounded-xl2 p-5 text-sm md:hidden">
          {navSections.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              onClick={() => setOpen(false)}
              className={isHome && activeKey === s.key ? 'font-medium text-primary' : ''}
            >
              {SECTION_LABELS[s.key]}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
