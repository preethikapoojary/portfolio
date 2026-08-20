import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme-mode') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
