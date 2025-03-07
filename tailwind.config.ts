import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "100": "#751423",
          DEFAULT: "#751423",
        },
        secondary: "#FBE843",
        black: {
          "100": "#111827",
          "200": "#1E1E1E",
          "300": "#6B7280",
          DEFAULT: "#000000"
        },
        white: {
          "100": "#F7F7F7",
          DEFAULT: "#FFFFFF"
        }
      },
      fontFamily: {
        figtree: ["Figtree","poppins", "sans-serif"],
        general: ['general Sans', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        100: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        // 200: "2px 2px 0px 2px rgb(0, 0, 0)",
        // 300: "2px 2px 0px 2px rgb(238, 43, 105)"
      }
    }
  },
  plugins: []
} satisfies Config;
