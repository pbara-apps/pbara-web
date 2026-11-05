import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

/** Colour backed by an RGB-channel CSS variable, so opacity modifiers work. */
const c = (name: string) => `rgb(var(--rgb-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: c("primary"),
        navy: c("primary"),
        "navy-deep": c("primary"),
        ink: c("ink"),
        gold: c("gold"),
        "gold-soft": c("gold-light"),
        "accent-gold": c("gold"),
        // Surfaces
        background: c("background"),
        ivory: c("background"),
        surface: c("surface"),
        mist: c("mist"),
        // Text
        "text-dark": c("text-dark"),
        "text-muted": c("text-muted"),
        line: "var(--color-line)",
      },
      fontFamily: {
        heading: ["var(--font-family-heading)", "sans-serif"],
        body: ["var(--font-family-body)", "sans-serif"],
        mono: ["var(--font-family-mono)", "monospace"],
      },
      maxWidth: {
        site: "82rem",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "scroll-cue": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        "scroll-cue": "scroll-cue 2.4s cubic-bezier(0.65,0,0.35,1) infinite",
      },
    },
  },
  darkMode: "class",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [heroui()] as any,
};
export default config;
