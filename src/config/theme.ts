const emerald = {
  50: "#ECFDF5",
  100: "#D1FAE5",
  200: "#A7F3D0",
  300: "#6EE7B7",
  400: "#34D399",
  500: "#10B981",
  600: "#059669",
  700: "#047857",
  800: "#065F46",
  900: "#064E3B",
};

const slate = {
  50: "#F8FAFC",
  100: "#F1F5F9",
  200: "#E2E8F0",
  300: "#CBD5E1",
  400: "#94A3B8",
  500: "#64748B",
  600: "#475569",
  700: "#334155",
  800: "#1E293B",
  900: "#0F172A",
};

/** Inputs for a HeroUI semantic theme. */
type ThemeInput = {
  background: string;
  foreground: string;
  divider: string;
  focus: string;
  primary: string;
  primaryFg: string;
  secondary: string;
  secondaryFg: string;
  successFg: string;
  danger: string;
  dangerFg: string;
  warning: string;
  warningFg: string;
  defaultFg: string;
};

/** Semantic token set applied to a HeroUI theme. */
function makeTheme({
  background,
  foreground,
  divider,
  focus,
  primary,
  primaryFg,
  secondary,
  secondaryFg,
  successFg,
  danger,
  dangerFg,
  warning,
  warningFg,
  defaultFg,
}: ThemeInput) {
  return {
    colors: {
      background: { DEFAULT: background },
      foreground: { ...slate, DEFAULT: foreground },
      divider: { DEFAULT: divider },
      focus: { DEFAULT: focus },
      overlay: { DEFAULT: "#000000" },

      primary: { ...emerald, foreground: primaryFg, DEFAULT: primary },
      secondary: { ...slate, foreground: secondaryFg, DEFAULT: secondary },
      success: { ...emerald, foreground: successFg, DEFAULT: emerald[500] },
      warning: { ...emerald, foreground: warningFg, DEFAULT: warning },
      danger: { ...emerald, foreground: dangerFg, DEFAULT: danger },

      default: { ...slate, foreground: defaultFg, DEFAULT: slate[200] },
    },
  };
}

export const brandThemes = {
  dark: makeTheme({
    background: "#070B12",
    foreground: "#F8FAFC",
    divider: "#1E293B",
    focus: emerald[400],

    primary: emerald[400],
    primaryFg: emerald[900],

    secondary: slate[300],
    secondaryFg: slate[900],

    successFg: emerald[900],

    danger: "#F87171",
    dangerFg: "#450A0A",

    warning: "#FBBF24",
    warningFg: "#451A03",

    defaultFg: slate[50],
  }),

  light: makeTheme({
    background: "#F8FAFC",
    foreground: "#0C121C",
    divider: "#E2E8F0",
    focus: emerald[600],

    primary: emerald[600],
    primaryFg: "#FFFFFF",

    secondary: slate[800],
    secondaryFg: "#FFFFFF",

    successFg: "#FFFFFF",

    danger: "#DC2626",
    dangerFg: "#FFFFFF",

    warning: "#D97706",
    warningFg: "#FFFFFF",

    defaultFg: slate[900],
  }),
};

/** Series colours for Recharts — ordered so adjacent series stay distinct. */
export const chartPalette = [
  emerald[500],
  slate[400],
  emerald[300],
  "#FBBF24",
  slate[600],
  emerald[700],
  "#F87171",
  slate[300],
];

/**
 * Per-status colours for data-viz (donuts / status bars). Keyed by the
 * ORDER_STATUS values; anything unknown falls back to slate.
 */
export const statusPalette: Record<string, string> = {
  PENDING: "#F59E0B",
  PROCESSING: emerald[500],
  SHIPPED: "#6366F1",
  DELIVERED: "#84CC16",
  CANCELLED: "#EF4444",
};

export const statusPaletteFallback = slate[400];