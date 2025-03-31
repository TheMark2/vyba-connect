import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        vyba: {
          cream: "#FAF8F6",
          blue: "#D4DDFF",
          beige: "#F5F1EB",
          navy: "#222845",
          dark: {
            bg: "#000000", // Negro puro para fondos principales
            secondary: "#333333" // Color gris oscuro (rgb(51, 51, 51)) para elementos secundarios
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D4DDFF",
          hover: "#EBEFFF",
          foreground: "#222845",
        },
        secondary: {
          DEFAULT: "#F5F1EB",
          hover: "#EDE8E0",
          foreground: "#222845",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
      transitionProperty: {
        'max-height': 'max-height',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "collapsible-down": {
          from: { height: "0", opacity: "0", transform: "translateY(-8px)" },
          to: { height: "var(--radix-collapsible-content-height)", opacity: "1", transform: "translateY(0)" }
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)", opacity: "1", transform: "translateY(0)" },
          to: { height: "0", opacity: "0", transform: "translateY(-8px)" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "image-fade-in": {
          "0%": { opacity: "0", transform: "scale(1.05)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "image-fade-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.05)" },
        },
        "content-expand": {
          "0%": { maxHeight: "0" },
          "100%": { maxHeight: "200px" }
        },
        "content-collapse": {
          "0%": { maxHeight: "200px" },
          "100%": { maxHeight: "0" }
        },
        "feature-item-appear": {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "radial-in": {
          "0%": { opacity: "0", background: "radial-gradient(circle at var(--x) var(--y), rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)" },
          "100%": { opacity: "1", background: "radial-gradient(circle at var(--x) var(--y), rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 80%)" },
        },
        "radial-out": {
          "0%": { opacity: "1", background: "radial-gradient(circle at var(--x) var(--y), rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 80%)" },
          "100%": { opacity: "0", background: "radial-gradient(circle at var(--x) var(--y), rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.5s ease-out",
        "accordion-up": "accordion-up 0.5s ease-out",
        "collapsible-down": "collapsible-down 0.5s ease-out",
        "collapsible-up": "collapsible-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "image-fade-in": "image-fade-in 0.5s ease-out",
        "image-fade-out": "image-fade-out 0.3s ease-out",
        "content-expand": "content-expand 0.3s ease-out forwards",
        "content-collapse": "content-collapse 0.3s ease-out forwards",
        "feature-item-appear": "feature-item-appear 0.4s ease-out forwards",
        "radial-in": "radial-in 0.3s ease-out forwards",
        "radial-out": "radial-out 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
