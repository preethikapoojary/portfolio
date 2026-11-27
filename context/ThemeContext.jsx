'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ mode: 'light', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('editorial-theme');
    if (saved === 'dark' || saved === 'light') {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('editorial-theme', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
