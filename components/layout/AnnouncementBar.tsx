"use client";

import Link from "next/link";

/**
 * Top announcement bar: portal tagline + Portals / Donations links
 */
export function AnnouncementBar() {
  return (
    <header className="bg-primary text-white text-xs uppercase tracking-wider py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-white/90">
          THE ROYAL AMBASSADORS OF NIGERIA · EST. 1920<sub>s</sub>
        </span>
        <nav className="flex items-center gap-4" aria-label="Top links">
          <Link
            href="https://portal.pbara.org.ng"
            className="text-white/90 hover:text-gold transition-colors"
          >
            PORTALS
          </Link>
          <span className="text-white/50">·</span>
          {/* <Link
            href="/contact"
            className="text-white/90 hover:text-gold transition-colors"
          >
            DONATIONS
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
