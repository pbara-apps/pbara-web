"use client";

import type { Executive } from "@/types";
import { cn } from "@/lib/cn";
import { PersonPhoto } from "@/components/site/PersonPhoto";

interface ExecutiveCardProps {
  executive: Executive;
  /** Kept for backwards compatibility; all cards share the portrait layout. */
  variant?: "default" | "officer";
  className?: string;
}

/** Portrait card: consistent 4:5 frame, position label, name and church. */
export function ExecutiveCard({ executive, className }: ExecutiveCardProps) {
  return (
    <article className={cn("group", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-mist">
        <PersonPhoto
          src={executive.image}
          name={executive.name}
          className="grayscale-[30%] transition-[transform,filter] duration-[1.1s] ease-brand group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-0 bg-gold transition-[width] duration-700 ease-brand group-hover:w-full"
        />
      </div>
      <div className="pt-4">
        <p className="eyebrow text-gold">{executive.position || "Officer"}</p>
        <h3 className="mt-2 text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink">
          {executive.name}
        </h3>
        {executive.church ? (
          <p className="mt-1 text-sm text-text-muted">{executive.church}</p>
        ) : null}
      </div>
    </article>
  );
}
