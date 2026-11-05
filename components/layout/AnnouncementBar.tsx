"use client";

import { PortalsMenu } from "./PortalsMenu";

/**
 * Top announcement bar: tagline + Portals menu (chapter / admin login)
 */
export function AnnouncementBar() {
  // relative + z-[60]: sits above the sticky Navbar (z-50) so the Portals menu isn't covered.
  return (
    <header className="relative z-[60] bg-primary text-white text-xs uppercase tracking-wider py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-white/90">
          THE ROYAL AMBASSADORS OF NIGERIA · EST. 1920<span className="text-[9px]">s</span>
        </span>
        <nav className="flex items-center gap-4" aria-label="Top links">
          <PortalsMenu />
          <span className="text-white/50">·</span>
          
        </nav>
      </div>
    </header>
  );
}
