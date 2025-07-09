import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  darkMode: 'class',
plugins: [
  nextui(),
  function ({ addVariant }) {
    addVariant("products-gt-1", '[data-products="1"] &');
    addVariant("sm:products-gt-2", '[data-products>="2"] &');
    addVariant("lg:products-gt-3", '[data-products>="3"] &');
  },
],
};
