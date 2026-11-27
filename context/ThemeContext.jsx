'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ mode: 'light', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('editorial-theme');
    if (saved === 'dark' || saved === 'light') {
      setMode(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('editorial-theme', mode);
  }, [mode, hydrated]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
