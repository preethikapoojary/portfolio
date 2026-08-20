/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // These reference CSS custom properties injected at runtime from
        // SiteSettings.theme (see SettingsContext) — so the entire palette
        // is admin-editable without a rebuild.
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        surface: '#0B0F19',
        'surface-soft': '#11162326',
        glass: 'rgba(255,255,255,0.11)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glass: '0 10px 36px 0 rgba(0,0,0,0.42)',
        glow: '0 0 40px -10px var(--color-primary)',
      },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};
