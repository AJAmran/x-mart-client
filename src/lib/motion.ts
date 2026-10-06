"use client";

import { useReducedMotion, type Variants } from "framer-motion";


const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
const EASE_STANDARD = [0.2, 0, 0, 1] as const;

export const durations = {
  instant: 0.12,
  fast: 0.18,
  base: 0.24,
  slow: 0.32,
  slower: 0.48,
} as const;

/** Shared easing curves. */
export const easings = {
  entrance: EASE_ENTRANCE,
  standard: EASE_STANDARD,
} as const;


export function useMotion() {
  const reduced = useReducedMotion();

  if (reduced) {
    return {
      reduced: true as const,
      container: staticVariants,
      item: staticVariants,
      fade: staticVariants,
      scale: staticVariants,
      stagger: 0,
      /** Skip the initial "hidden" pass so nothing flashes in. */
      initial: false as const,
    };
  }

  return {
    reduced: false as const,
    container: containerVariants,
    item: itemVariants,
    fade: fadeVariants,
    scale: scaleVariants,
    stagger: 0.05,
    initial: "hidden" as const,
  };
}

const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
};

/** Parent orchestrator. Children opt in with `item`. */
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

/** Default child entrance: 12px rise + fade. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slower, ease: EASE_ENTRANCE },
  },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.slow, ease: EASE_STANDARD } },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.slow, ease: EASE_ENTRANCE },
  },
};

/** Interactive feedback used by cards and pressable tiles. */
export const pressable = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: durations.fast, ease: EASE_STANDARD } },
  press: { scale: 0.985, transition: { duration: durations.instant } },
} satisfies Variants;

export type Motion = ReturnType<typeof useMotion>;