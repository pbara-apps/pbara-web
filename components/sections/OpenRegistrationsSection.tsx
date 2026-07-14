"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { RegistrationProgramCard } from "@/components/registration/RegistrationProgramCard";
import {
  buttonHover,
  buttonTap,
  fadeInUp,
  inViewProps,
  motionSafe,
  scalePop,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import type { RegistrationProgram } from "@/types";

interface OpenRegistrationsSectionProps {
  programs: RegistrationProgram[];
  /** Total open programs (may be more than the preview list). */
  totalCount?: number;
}

export function OpenRegistrationsSection({
  programs,
  totalCount,
}: OpenRegistrationsSectionProps) {
  const reduced = useReducedMotion();
  const view = inViewProps(reduced);

  if (programs.length === 0) return null;

  const total = totalCount ?? programs.length;
  const showViewAll = total > programs.length || total > 1;

  return (
    <section
      className="bg-surface py-20"
      aria-labelledby="open-registrations-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row"
          {...view}
          variants={motionSafe(reduced, fadeInUp)}
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Open now
            </p>
            <h2
              id="open-registrations-heading"
              className="font-heading text-4xl font-black tracking-tight text-primary"
            >
              Open Registrations
            </h2>
            <p className="font-medium text-text-muted">
              Active programs accepting registration — pay and complete your
              entry online.
            </p>
          </div>
          {showViewAll ? (
            <motion.div
              variants={motionSafe(reduced, scalePop)}
              whileHover={reduced ? undefined : buttonHover}
              whileTap={reduced ? undefined : buttonTap}
            >
              <Link
                href="/registration"
                className="inline-flex min-h-[44px] touch-manipulation items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-bold uppercase tracking-wider text-primary shadow-sm transition-shadow hover:shadow-md"
              >
                View all <FiArrowRight size={16} aria-hidden />
              </Link>
            </motion.div>
          ) : null}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          {...view}
          variants={motionSafe(reduced, staggerContainer)}
        >
          {programs.map((program) => (
            <motion.div
              key={program.id}
              variants={motionSafe(reduced, staggerItem)}
            >
              <RegistrationProgramCard program={program} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
