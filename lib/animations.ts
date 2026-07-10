import type { Transition, Variants } from "framer-motion";

/** Refined cubic-bezier — professional, not bouncy */
export const EASE_REFINED: [number, number, number, number] = [
  0.25, 0.1, 0.25, 1,
];

export const defaultTransition: Transition = {
  duration: 0.55,
  ease: EASE_REFINED,
};

export const fastTransition: Transition = {
  duration: 0.4,
  ease: EASE_REFINED,
};

export const slowTransition: Transition = {
  duration: 0.7,
  ease: EASE_REFINED,
};

/** Scroll trigger: play once when ~20% of the element is visible */
export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Instant / no-op variants for prefers-reduced-motion */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

/** Subtle scale pop for CTA buttons / emphasis */
export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: fastTransition,
  },
};

/** Parent for staggered children (cards, grids) */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Child item used inside staggerContainer */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/** Hero content — mount (not scroll): clear slide-up + soft zoom */
export const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: EASE_REFINED,
    },
  },
};

/** Hero headline — slightly stronger entrance */
export const heroHeadline: Variants = {
  hidden: { opacity: 0, y: 72, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: EASE_REFINED,
    },
  },
};

/** Hero background — subtle zoom-in on mount */
export const heroImageZoom: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: slowTransition,
  },
};

/** Hero content stagger — longer gaps so each beat is readable */
export const heroStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.12,
    },
  },
};

/** Micro-interaction: button hover / tap (transform only) */
export const buttonHover = { scale: 1.03 };
export const buttonTap = { scale: 0.98 };

/** Micro-interaction: card lift on hover */
export const cardHover = {
  y: -6,
  boxShadow:
    "0 12px 28px -8px rgba(15, 23, 42, 0.18), 0 4px 10px -4px rgba(15, 23, 42, 0.08)",
  transition: fastTransition,
};

export const cardTap = { scale: 0.99 };

/**
 * Pick variants that respect prefers-reduced-motion.
 * Pass the result of `useReducedMotion()` from framer-motion.
 */
export function motionSafe<T extends Variants>(
  reduced: boolean | null,
  variants: T,
): T | typeof reducedMotionVariants {
  return reduced ? reducedMotionVariants : variants;
}

/**
 * Shared whileInView props. When reduced motion is on, content
 * renders in its final state with no entrance animation.
 */
export function inViewProps(reduced: boolean | null) {
  if (reduced) {
    return {
      initial: false as const,
      animate: "visible" as const,
    };
  }
  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: viewportOnce,
  };
}

/** Mount (non-scroll) props for hero / above-the-fold */
export function mountProps(reduced: boolean | null) {
  if (reduced) {
    return {
      initial: false as const,
      animate: "visible" as const,
    };
  }
  return {
    initial: "hidden" as const,
    animate: "visible" as const,
  };
}
