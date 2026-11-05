"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Reduced-motion preference that is always `false` during SSR and the first
 * client render, so server and client markup match. Framer's global
 * `MotionConfig reducedMotion="user"` (see app/providers.tsx) already skips
 * transform animations; this hook covers scroll-linked effects and timers.
 */
export function usePrefersReducedMotion(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? Boolean(reduced) : false;
}

// Trigger as soon as any part is ~10% into the viewport. A fractional `amount`
// never fires for elements taller than the screen (long lists on mobile).
const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -10% 0px" } as const;

type Tag = "div" | "section" | "li" | "ul" | "ol" | "article" | "header" | "p" | "span";

/** Fades + lifts content into view once. No-op with reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
}) {
  const reduced = usePrefersReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Parent for staggered children. Pair with <StaggerItem>. */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduced = usePrefersReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={staggerParent}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/**
 * Image frame that wipes open from the bottom and settles from a slight zoom.
 * Children should be an absolutely-filled image.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      // Only default to `relative` when the caller hasn't positioned the frame.
      className={cn(
        /\b(absolute|fixed|sticky)\b/.test(className ?? "") ? "" : "relative",
        "overflow-hidden",
        className,
      )}
      initial={reduced ? false : { clipPath: "inset(18% 0% 0% 0%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Gentle vertical parallax for a filled image inside an overflow-hidden frame.
 * `strength` is the travel in percent of the frame height.
 */
export function Parallax({
  children,
  className,
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -inset-y-[12%] inset-x-0"
        style={reduced ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({
  to,
  suffix = "",
  duration = 1.8,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {/* Screen readers (and no-JS crawlers) get the final figure directly. */}
      <span className="sr-only">
        {to.toLocaleString("en-NG")}
        {suffix}
      </span>
      <span aria-hidden>
        {value.toLocaleString("en-NG")}
        {suffix}
      </span>
    </span>
  );
}
