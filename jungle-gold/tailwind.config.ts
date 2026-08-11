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
        forest: {
          DEFAULT: "#0F2D1F",
          50: "#1a4a33",
          100: "#163d2a",
          200: "#0F2D1F",
          300: "#0a1f15",
          400: "#06120c",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#f5e9a3",
          100: "#edd978",
          200: "#e5c94d",
          300: "#D4AF37",
          400: "#b8952e",
          500: "#9c7b25",
        },
        cream: {
          DEFAULT: "#FDF6E3",
          50: "#ffffff",
          100: "#FDF6E3",
          200: "#f9edd0",
          300: "#f3e2b5",
        },
        bark: {
          DEFAULT: "#5C3D1E",
          100: "#7a5228",
          200: "#5C3D1E",
          300: "#3e2a15",
        },
        honey: {
          DEFAULT: "#E8A020",
          100: "#f0bb55",
          200: "#E8A020",
          300: "#c4861a",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #E8A020 50%, #D4AF37 100%)",
        "forest-gradient": "linear-gradient(180deg, #0F2D1F 0%, #0a1f15 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(212, 175, 55, 0.4)",
        "gold-glow-lg": "0 0 60px rgba(212, 175, 55, 0.5)",
        "forest-deep": "0 25px 60px rgba(0,0,0,0.6)",
        "glass": "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
