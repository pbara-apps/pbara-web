"use client";

import type { HeroStat } from "@/types";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { Eyebrow } from "@/components/site/primitives";

/**
 * Association figures. Values come from the admin-managed hero stats
 * (`/admin/hero-stats/public`) so every page shows the same numbers.
 */
export function StatsBar({ stats }: { stats: HeroStat[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="bg-ivory" aria-labelledby="stats-heading">
      <div className="container-site py-14 sm:py-20 md:py-24">
        <div className="grid gap-9 sm:gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-4">
            <Eyebrow>At a glance</Eyebrow>
            <h2
              id="stats-heading"
              className="mt-4 font-heading text-[23px] font-bold leading-[1.18] tracking-[-0.03em] text-ink sm:mt-5 sm:text-[28px] md:text-[32px] text-balance"
            >
              One association. Many chapters. One commitment to raising godly
              young men.
            </h2>
          </Reveal>

          <Stagger
            as="ul"
            className="grid grid-cols-3 border-y border-line sm:border-y-0 lg:col-span-8"
          >
            {stats.slice(0, 3).map((s, i) => (
              <StaggerItem
                as="li"
                key={s.label}
                className={`min-w-0 py-5 sm:py-2 sm:pl-8 ${
                  i > 0 ? "border-l border-line pl-3.5 min-[400px]:pl-5" : "pr-2 sm:pl-0 lg:border-l lg:pl-8"
                }`}
              >
                <p className="font-heading text-[clamp(2.1rem,10.5vw,3rem)] font-extrabold leading-none tracking-[-0.05em] text-ink sm:text-[clamp(3.5rem,7vw,6rem)]">
                  <CountUp to={s.end} />
                  <span className="text-gold">{s.suffix}</span>
                </p>
                <p className="eyebrow mt-3 text-[9.5px] leading-[1.5] tracking-[0.12em] text-text-muted min-[400px]:text-[10.5px] sm:mt-4 sm:text-[11px] sm:tracking-[0.18em]">
                  {s.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
