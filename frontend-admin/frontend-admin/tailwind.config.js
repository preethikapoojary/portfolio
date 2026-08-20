/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-dark': '#4F46E5',
        surface: '#F8FAFC',
        panel: '#FFFFFF',
        ink: '#0F172A',
        muted: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)',
      },
    },
  },
  plugins: [],
};
