import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0056A0",
        secondary: "#004080",
        accent: "#FFD700",
        background: "#F4F4F4",
        text: "#333333",
        mutedText: "#7D7D7D",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        helvetica: ["Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
