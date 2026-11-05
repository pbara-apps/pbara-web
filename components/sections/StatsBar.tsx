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
      <div className="container-site py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-4">
            <Eyebrow>At a glance</Eyebrow>
            <h2
              id="stats-heading"
              className="mt-5 font-heading text-[28px] font-bold leading-[1.15] tracking-[-0.03em] text-ink md:text-[32px] text-balance"
            >
              One association. Many chapters. One commitment to raising godly
              young men.
            </h2>
          </Reveal>

          <Stagger
            as="ul"
            className="grid grid-cols-1 border-t border-line sm:grid-cols-3 sm:border-t-0 lg:col-span-8"
          >
            {stats.slice(0, 3).map((s, i) => (
              <StaggerItem
                as="li"
                key={s.label}
                className={`border-b border-line py-8 sm:border-b-0 sm:py-2 sm:pl-8 ${
                  i > 0 ? "sm:border-l" : "sm:pl-0 lg:border-l lg:pl-8"
                }`}
              >
                <p className="font-heading text-[clamp(3.5rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.05em] text-ink">
                  <CountUp to={s.end} />
                  <span className="text-gold">{s.suffix}</span>
                </p>
                <p className="eyebrow mt-4 text-text-muted">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
