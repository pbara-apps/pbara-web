"use client";

import { motion, useReducedMotion } from "framer-motion";
import { stats } from "@/data/events";
import {
  fadeInUp,
  inViewProps,
  motionSafe,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

export function StatsBar() {
  const reduced = useReducedMotion();
  const view = inViewProps(reduced);

  return (
    <motion.section
      className="bg-background py-12"
      aria-labelledby="stats-heading"
      {...view}
      variants={motionSafe(reduced, fadeInUp)}
    >
      <h2 id="stats-heading" className="sr-only">
        Association at a glance
      </h2>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={motionSafe(reduced, staggerContainer)}
          {...view}
        >
          {stats.map(({ icon: Icon, end, label, suffix }) => (
            <motion.div
              key={label}
              className="text-center"
              variants={motionSafe(reduced, staggerItem)}
            >
              <span
                className="inline-flex items-center justify-center text-gold mb-2"
                aria-hidden
              >
                <Icon size={28} />
              </span>
              <p className="font-heading text-3xl md:text-4xl font-bold text-text-dark">
                {end}
                {suffix}
              </p>
              <p className="text-sm uppercase tracking-wider text-text-muted mt-1">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
