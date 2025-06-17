import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#262B36",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#4A6EE0",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#17B890",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FDBA74",
          foreground: "#262B36",
        },
        error: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        "base-0": "#FFFFFF",
        "base-fg": "#EDEFF3",
        secondary: {
          DEFAULT: "#EDEFF3",
          foreground: "#262B36",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#EDEFF3",
          foreground: "#6B7280",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#262B36",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#262B36",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "0.75rem",
        button: "0.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.07)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
        numeric: ["var(--font-jetbrains-mono)"],
      },
      screens: {
        sm: "640px",
        lg: "1024px",
        xl: "1440px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
