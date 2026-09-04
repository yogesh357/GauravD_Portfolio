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
        canvas: {
          DEFAULT: "#F4F1EB", // Warm ivory / fine art paper
          muted: "#ECE7DE",
          dark: "#0D0D0D", // Deep carbon
          card: "#E7E2D8",
        },
        ink: {
          DEFAULT: "#111111", // Deep ink
          muted: "#6F6B63", // Secondary editorial metadata
          faded: "#9C978E",
          light: "#F4F1EB",
        },
        bronze: {
          DEFAULT: "#9E8262", // Muted warm bronze
          light: "#B89D7C",
          dark: "#7B6245",
        },
        border: {
          light: "rgba(17, 17, 17, 0.08)",
          medium: "rgba(17, 17, 17, 0.16)",
          dark: "rgba(244, 241, 235, 0.12)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Geist", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
        ultra: "0.35em",
      },
      aspectRatio: {
        "4/5": "4 / 5",
        "3/4": "3 / 4",
        "16/10": "16 / 10",
        "2/3": "2 / 3",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
