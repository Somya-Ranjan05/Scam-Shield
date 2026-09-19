/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Theme
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a4f7",
          500: "#0c87eb",
          600: "#026ac8",
          700: "#0254a2",
          800: "#064785",
          900: "#0b3c6f",
          950: "#07264a",
        },
        // Risk Tier: Safe (Calm Green / Emerald)
        riskSafe: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          bg: "#064e3b",
        },
        // Risk Tier: Suspicious (Cautionary Amber)
        riskSuspicious: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          bg: "#78350f",
        },
        // Risk Tier: Dangerous (Warning Orange-Red)
        riskDangerous: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          bg: "#7c2d12",
        },
        // Risk Tier: Confirmed Scam (Critical Crimson)
        riskConfirmed: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          bg: "#7f1d1d",
        },
        // Dark Base Slate
        slateDark: {
          850: "#131b2e",
          900: "#0b1120",
          950: "#060913",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
