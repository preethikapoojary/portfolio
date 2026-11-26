import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Public theme tokens (driven by CSS variables from SiteSettings.theme)
        primary: "var(--color-primary, #6366F1)",
        secondary: "var(--color-secondary, #8B5CF6)",
        accent: "var(--color-accent, #F59E0B)",
        surface: "#0B0F19",
        "surface-soft": "#11162326",
        glass: "rgba(255,255,255,0.11)",
        // Admin panel tokens
        "admin-primary": "#6366F1",
        "admin-primary-dark": "#4F46E5",
        "admin-surface": "#F8FAFC",
        "admin-panel": "#FFFFFF",
        "admin-ink": "#0F172A",
        "admin-muted": "#64748B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glass: "0 10px 36px 0 rgba(0,0,0,0.42)",
        glow: "0 0 40px -10px var(--color-primary)",
        card: "0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};

export default config;
