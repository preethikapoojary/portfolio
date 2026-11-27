import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial warm-neutral palette
        ivory: "#F6F4EF",
        sand: "#E9E5DC",
        charcoal: "#22221F",
        stone: "#89877F",
        olive: "#85806D",
        hairline: "#DCD9D1",
        // Admin panel tokens (kept intact for /admin)
        "admin-primary": "#6366F1",
        "admin-primary-dark": "#4F46E5",
        "admin-surface": "#F8FAFC",
        "admin-panel": "#FFFFFF",
        "admin-ink": "#0F172A",
        "admin-muted": "#64748B",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
