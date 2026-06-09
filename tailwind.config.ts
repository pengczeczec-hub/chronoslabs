import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: "#F5F5F7",
        muted: "#8E8E93",
        accent: "#FF5722",
        ultra: "#050505",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Roboto", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 87, 34, 0.4), 0 0 60px rgba(255, 87, 34, 0.15)",
        "neon-lg":
          "0 0 30px rgba(255, 87, 34, 0.5), 0 0 80px rgba(255, 87, 34, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
