import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f0e4",
        ink: "#11100d",
        muted: "#6f675a",
        rule: "#d7c9b5",
        good: "#2f6f45",
        warning: "#a7482b",
        opportunity: "#b88a20",
        verified: "#2d5d8a"
      },
      fontFamily: {
        serif: ["var(--font-news-serif)", "Georgia", "serif"],
        sans: ["var(--font-civic-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        civic: "0 18px 60px rgba(35, 28, 20, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
