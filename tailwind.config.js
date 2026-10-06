import { heroui } from "@heroui/theme";
import { brandThemes } from "./src/config/theme";

/**
 * Colour helpers. Tokens are stored as space-separated RGB channel triplets so
 * Tailwind's `<alpha-value>` slot keeps opacity modifiers (`bg-surface/60`)
 * working everywhere.
 */
const channel = (name) => `rgb(var(${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx,mjs,cjs}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      colors: {
        /* ---- Tier 2: semantic roles. Theme-aware, always prefer these. ---- */
        surface: {
          DEFAULT: channel("--surface"),
          raised: channel("--surface-raised"),
          sunken: channel("--surface-sunken"),
          inset: channel("--surface-inset"),
          inverse: channel("--surface-inverse"),
        },
        content: {
          DEFAULT: channel("--content"),
          muted: channel("--content-muted"),
          subtle: channel("--content-subtle"),
          inverted: channel("--content-inverted"),
        },
        line: {
          DEFAULT: channel("--line"),
          strong: channel("--line-strong"),
          hairline: channel("--line-hairline"),
        },
        brand: {
          DEFAULT: channel("--brand"),
          hover: channel("--brand-hover"),
          subtle: channel("--brand-subtle"),
          contrast: channel("--brand-contrast"),
        },
        accent: {
          DEFAULT: channel("--accent"),
          subtle: channel("--accent-subtle"),
        },
        ring: channel("--ring"),

        /* ---- Tier 1: raw primitives. Use for gradients/data-viz only. ---- */
        emerald: {
          50: channel("--emerald-50"),
          100: channel("--emerald-100"),
          200: channel("--emerald-200"),
          300: channel("--emerald-300"),
          400: channel("--emerald-400"),
          500: channel("--emerald-500"),
          600: channel("--emerald-600"),
          700: channel("--emerald-700"),
          800: channel("--emerald-800"),
          900: channel("--emerald-900"),
        },
        lime: {
          100: channel("--lime-100"),
          200: channel("--lime-200"),
          300: channel("--lime-300"),
          400: channel("--lime-400"),
          500: channel("--lime-500"),
        },
        ink: {
          0: channel("--ink-0"),
          25: channel("--ink-25"),
          50: channel("--ink-50"),
          100: channel("--ink-100"),
          200: channel("--ink-200"),
          300: channel("--ink-300"),
          400: channel("--ink-400"),
          500: channel("--ink-500"),
          600: channel("--ink-600"),
          700: channel("--ink-700"),
          800: channel("--ink-800"),
          850: channel("--ink-850"),
          900: channel("--ink-900"),
          950: channel("--ink-950"),
        },
      },

      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-2xl)",
      },

      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        brand: "var(--shadow-brand)",
        none: "none",
      },

      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },

      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        entrance: "var(--ease-entrance)",
        exit: "var(--ease-exit)",
      },

      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        sticky: "var(--z-sticky)",
        header: "var(--z-header)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
      },

      /* Fluid type scale — no manual breakpoint jumps between sizes. */
      fontSize: {
        "display-lg": ["clamp(2.25rem, 1.6rem + 3vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.875rem, 1.4rem + 2.2vw, 2.875rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-sm": ["clamp(1.5rem, 1.25rem + 1.2vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "title-lg": ["clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "title-md": ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        "label-sm": ["0.8125rem", { lineHeight: "1.4" }],
        "overline": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.14em" }],
      },

      maxWidth: {
        container: "80rem",
        prose: "68ch",
      },

      /* Horizontal rail item width. Single source of truth for every
         product carousel, replacing the repeated fixed-px class stacks. */
      width: {
        rail: "var(--rail-item)",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },

      animation: {
        "fade-in": "fade-in var(--duration-slow) var(--ease-entrance) both",
        "fade-in-up": "fade-in-up var(--duration-slower) var(--ease-entrance) both",
        "scale-in": "scale-in var(--duration-base) var(--ease-entrance) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: brandThemes,
      layout: {
        radius: { small: "10px", medium: "14px", large: "18px" },
        borderWidth: { small: "1px", medium: "2px", large: "3px" },
        disabledOpacity: ".5",
        dividerWeight: "1px",
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        hoverOpacity: { light: ".8", dark: ".9" },
        boxShadow: {
          small: "var(--shadow-sm)",
          medium: "var(--shadow-md)",
          large: "var(--shadow-lg)",
        },
      },
    }),
    function ({ addVariant, addUtilities }) {
      addVariant("products-gt-1", '[data-products="1"] &');
      addVariant("sm:products-gt-2", '[data-products>="2"] &');
      addVariant("lg:products-gt-3", '[data-products>="3"] &');

      addUtilities({
        ".xm-skeleton": {
          backgroundImage:
            "linear-gradient(90deg, rgb(var(--surface-sunken)) 0%, rgb(var(--line)) 50%, rgb(var(--surface-sunken)) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s linear infinite",
        },
        ".glass": {
          backgroundColor: "rgb(var(--surface-raised) / 0.72)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
        },
        ".rule-brand": {
          backgroundImage:
            "linear-gradient(to right, transparent, rgb(var(--brand) / 0.5), rgb(var(--accent) / 0.5), transparent)",
        },
      });
    },
  ],
};