import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/endpoints';

const SettingsContext = createContext(null);

/**
 * Fetches Profile / SiteSettings / Sections once at app boot and provides
 * them everywhere via context — avoids prop-drilling and redundant API
 * calls, and is the single place that injects the admin-editable theme
 * (colors, fonts, favicon) as CSS custom properties at runtime, per the
 * architecture's "no rebuild needed for theme changes" requirement.
 */
export function SettingsProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [sections, setSections] = useState([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        api.getProfile(),
        api.getSettings(),
        api.getSections(),
      ]);

      const profileRes = results[0];
      const settingsRes = results[1];
      const sectionsRes = results[2];

      if (profileRes.status === 'fulfilled' && profileRes.value) {
        setProfile(profileRes.value);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        setSettings(settingsRes.value);
      }
      if (sectionsRes.status === 'fulfilled') {
        setSections(sectionsRes.value || []);
      }

      if (profileRes.status === 'rejected' || !profileRes.value) {
        setError(
          (profileRes.reason && profileRes.reason.message) ||
            'Unable to load portfolio details. Please check your connection.'
        );
      }
    } catch (err) {
      setError(err.message || 'Unable to load portfolio details.');
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!settings?.theme) return;
    const root = document.documentElement;
    const { primaryColor, secondaryColor, accentColor, fontFamily } = settings.theme;
    if (primaryColor) root.style.setProperty('--color-primary', primaryColor);
    if (secondaryColor) root.style.setProperty('--color-secondary', secondaryColor);
    if (accentColor) root.style.setProperty('--color-accent', accentColor);
    if (fontFamily) root.style.setProperty('--font-body', fontFamily);

    if (settings.favicon?.url) {
      const link = document.getElementById('favicon');
      if (link) link.href = settings.favicon.url;
    }
    if (settings.seo?.metaTitle) document.title = settings.seo.metaTitle;
  }, [settings]);

  const isSectionVisible = (key) => {
    const s = sections.find((sec) => sec.key === key);
    return s ? s.isVisible : true; // default visible if Sections hasn't loaded/seeded that key yet
  };
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <SettingsContext.Provider
      value={{
        profile,
        settings,
        sections: orderedSections,
        isSectionVisible,
        ready,
        loading,
        error,
        retry: fetchInitialData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
