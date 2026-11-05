"use client";

import { PortalsMenu } from "./PortalsMenu";

/**
 * Slim utility bar above the main navigation. Keeps the portal sign-ins
 * visually separate from the public site navigation.
 */
export function AnnouncementBar() {
  // relative + z-[60]: sits above the sticky Navbar (z-50) so the Portals menu isn't covered.
  return (
    <div className="relative z-[60] border-b border-white/[0.06] bg-ink text-white">
      <div className="container-site flex h-10 items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.16em]">
        <p className="truncate text-white/55">
          <span className="text-gold">
            <span className="hidden sm:inline">Royal Ambassadors of Nigeria</span>
            <span className="sm:hidden">RAN</span>
          </span>
          <span className="mx-2 text-white/25" aria-hidden>
            /
          </span>
          <span className="hidden sm:inline">Lagos West Baptist Conference</span>
          <span className="sm:hidden">LWBC</span>
          <span className="mx-2 text-white/25" aria-hidden>
            /
          </span>
          <span className="hidden sm:inline">Pentecost Baptist Association</span>
          <span className="sm:hidden">PBA</span>
        </p>
        <PortalsMenu />
      </div>
    </div>
  );
}
