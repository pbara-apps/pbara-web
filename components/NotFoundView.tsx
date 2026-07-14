"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  buttonHover,
  buttonTap,
  defaultTransition,
  heroStaggerContainer,
  mountProps,
  motionSafe,
  staggerItem,
} from "@/lib/animations";

export function NotFoundView() {
  const reduced = useReducedMotion();
  const mount = mountProps(reduced);

  return (
    <section
      className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-hidden px-4 py-24"
      aria-labelledby="not-found-heading"
    >
      {/* Atmospheric field */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(27,36,82,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_90%,rgba(200,168,75,0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_10%_80%,rgba(27,36,82,0.06),transparent_45%)]" />
      </div>

      {/* Soft watermark numeral */}
      <motion.span
        className="pointer-events-none absolute select-none font-heading text-[clamp(11rem,28vw,20rem)] font-bold leading-none tracking-tighter text-primary/[0.04]"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        404
      </motion.span>

      <motion.div
        className="relative z-10 flex max-w-lg flex-col items-center text-center"
        {...mount}
        variants={motionSafe(reduced, heroStaggerContainer)}
      >
        <motion.div variants={motionSafe(reduced, staggerItem)}>
          <Image
            src="/images/ra-logo.png"
            alt="Royal Ambassadors"
            width={56}
            height={56}
            className="rounded-full object-contain"
            priority
          />
        </motion.div>

        <motion.p
          className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold"
          variants={motionSafe(reduced, staggerItem)}
        >
          Royal Ambassadors
        </motion.p>

        <motion.div
          className="mt-5 h-px w-10 origin-center bg-gold"
          variants={motionSafe(reduced, {
            hidden: { opacity: 0, scaleX: 0 },
            visible: {
              opacity: 1,
              scaleX: 1,
              transition: defaultTransition,
            },
          })}
          aria-hidden="true"
        />

        <motion.h1
          id="not-found-heading"
          className="mt-8 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl bg-primary px-8 py-6 rounded-xl"
          variants={motionSafe(reduced, staggerItem)}
        >
          Page not found
        </motion.h1>

        <motion.p
          className="text-base leading-relaxed text-text-muted sm:text-lg"
          variants={motionSafe(reduced, staggerItem)}
        >
          This address doesn&apos;t lead anywhere in our archives. The page may
          have moved, or the link may be out of date.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
          variants={motionSafe(reduced, staggerItem)}
        >
          <motion.div
            whileHover={reduced ? undefined : buttonHover}
            whileTap={reduced ? undefined : buttonTap}
          >
            <Button
              as={Link}
              href="/"
              className="h-12 min-w-[10.5rem] bg-primary px-7 text-sm font-semibold tracking-wide text-white shadow-md"
            >
              Return home
            </Button>
          </motion.div>
          <Link
            href="/contact"
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-gold hover:underline focus-ring"
          >
            Contact the support
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
