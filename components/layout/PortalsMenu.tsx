"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/** Base address of the portal app (admin + chapter portals). */
const PORTAL_URL = (process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.pbara.org.ng").replace(/\/$/, "");

const LINKS = [
  {
    label: "Chapter Login",
    hint: "Counsellors, presidents & secretaries",
    href: `${PORTAL_URL}/chapter/login`,
  },
  {
    label: "Admin Login",
    hint: "Association executives",
    href: `${PORTAL_URL}/login`,
  },
];

/**
 * "PORTALS" button in the top bar. Opens a small menu with the two
 * sign-in pages. Closes on outside click, Escape, or choosing a link.
 */
export function PortalsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-1 uppercase tracking-wider text-white/90 transition-colors hover:text-gold"
      >
        PORTALS
        <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg bg-white normal-case tracking-normal text-left shadow-xl ring-1 ring-black/5"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
            >
              <span className="block text-sm font-semibold text-primary">{link.label}</span>
              <span className="block text-xs text-slate-500">{link.hint}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
