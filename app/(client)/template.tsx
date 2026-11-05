"use client";

import { usePrefersReducedMotion } from "@/components/site/motion";
import { motion} from "framer-motion";

/**
 * Re-mounts on every public route change for a soft fade between pages.
 * Opacity only: a transform here would break `position: fixed` children
 * (lightboxes, modals) rendered inside pages.
 */
export default function ClientTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
