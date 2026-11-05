"use client";

import { usePrefersReducedMotion } from "@/components/site/motion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion} from "framer-motion";
import { FiArrowUpRight, FiChevronDown, FiLock } from "react-icons/fi";
import { PORTAL_LINKS } from "@/lib/portal";

/**
 * "Member portals" button in the utility bar. Opens a small menu with the two
 * sign-in pages. Closes on outside click, Escape, or choosing a link.
 */
export function PortalsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-white/80 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <FiLock className="h-3 w-3" aria-hidden />
        <span className="hidden sm:inline">Member portals</span>
        <span className="sm:hidden">Portals</span>
        <FiChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduced ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-[70] mt-2 w-72 origin-top-right overflow-hidden rounded-xl bg-white p-1.5 text-left normal-case tracking-normal shadow-[0_24px_60px_-20px_rgba(5,6,31,0.45)] ring-1 ring-line"
          >
            <p className="eyebrow px-3 pb-1 pt-2 text-text-muted">
              Portal sign-in
            </p>
            {PORTAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-ivory focus:bg-ivory focus:outline-none"
              >
                <span>
                  <span className="block font-body text-sm font-semibold text-ink">
                    {link.label}
                  </span>
                  <span className="block font-body text-xs text-text-muted">
                    {link.hint}
                  </span>
                </span>
                <FiArrowUpRight
                  className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  aria-hidden
                />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
