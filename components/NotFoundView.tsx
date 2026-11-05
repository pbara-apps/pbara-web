"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/site/primitives";
import { EASE } from "@/components/site/motion";

const SUGGESTIONS = [
  { href: "/about", label: "About the RA" },
  { href: "/events", label: "Events & programs" },
  { href: "/chapters", label: "Find a chapter" },
  { href: "/news", label: "Newsroom" },
];

export function NotFoundView() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-112px)] items-center overflow-hidden bg-ivory py-24"
      aria-labelledby="not-found-heading"
    >
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="pointer-events-none absolute -bottom-[0.18em] right-0 select-none font-heading text-[clamp(12rem,38vw,34rem)] font-extrabold leading-none tracking-[-0.07em] text-primary/[0.05]"
      >
        404
      </motion.span>

      <div className="container-site relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="eyebrow text-gold">Error 404</p>
          <h1 id="not-found-heading" className="display-lg mt-6 text-balance text-ink">
            This page has moved — or never existed.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-muted">
            The link may be out of date. Let&apos;s get you back on parade.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" variant="navy">
              Return home
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact us
            </ButtonLink>
          </div>
          <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
            {SUGGESTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="link-underline text-[15px] text-primary">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
