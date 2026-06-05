"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@heroui/react";
import { useScrollSize } from "@/hooks/useScrollSize";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/chapters", label: "Chapters" },
  { href: "/executives", label: "Officers" },
  { href: "/events", label: "Programs" },
  { href: "/news", label: "News" },
  { href: "/media", label: "Media" },
  { href: "/contact", label: "Contact" },
];

/** Pixels scrolled before the bar switches from “over hero” to solid primary. */
const SCROLL_SOLID_THRESHOLD = 48;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScrollSize();

  const isHome = pathname === "/";
  const overHero = isHome && scrollY <= SCROLL_SOLID_THRESHOLD && !mobileOpen;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 text-white transition-colors duration-300 ease-out",
        overHero ? "bg-transparent shadow-none" : "bg-primary shadow-md",
      )}
    >
      <nav
        className={cn(
          "max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-18",
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="PBA Royal Ambassadors home"
        >
          <Image
            src="/images/ra-logo.png"
            alt="Royal Ambassadors of Nigeria official logo, circular emblem with shield, crown, wheel, torch and laurel wreath"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="flex flex-col">
            <h2 className="text-slate-100 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
              RA Pentecost
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold">
              Baptist Association
            </span>
          </div>
        </Link>

        {/* Desktop nav links — centered */}
        <div className="hidden md:flex absolut left1/2 -translate-x1/2 items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`relative py-2 text-sm uppercase tracking-wider transition-colors hover:text-gold ${
                  isActive ? "text-gold" : "text-white/90"
                }`}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* JOIN NOW button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 py-3 flex flex-col gap-1 touch-action-manipulation">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-4 rounded-lg text-sm uppercase min-h-[44px] flex items-center ${isActive ? "text-gold bg-white/10 font-semibold" : "text-white/90 hover:bg-white/10"}`}
              >
                {label}
              </Link>
            );
          })}
          {/* <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 py-3 px-4 rounded-lg bg-gold text-primary font-semibold text-center uppercase text-sm min-h-[44px] flex items-center justify-center"
          >
            Join Now
          </Link> */}
        </div>
      )}
    </header>
  );
}
