"use client";

import type { PastOfficer } from "@/types";
import { Stagger, StaggerItem } from "@/components/site/motion";

interface PastOfficersTableProps {
  officers: PastOfficer[];
}

/** Past officers grouped by term of service, as an editorial roll of honour. */
export function PastOfficersTable({ officers }: PastOfficersTableProps) {
  const terms = new Map<string, PastOfficer[]>();
  for (const o of officers) {
    const key = `${o.yearStart}–${o.yearEnd}`;
    terms.set(key, [...(terms.get(key) ?? []), o]);
  }

  return (
    <div className="space-y-14">
      {Array.from(terms.entries()).map(([term, list]) => (
        <div key={term} className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow text-text-muted">Term of service</p>
            <p className="mt-2 font-heading text-4xl font-extrabold tracking-[-0.05em] text-primary">
              {term}
            </p>
          </div>
          <Stagger as="ul" className="md:col-span-9">
            {list.map((o) => (
              <StaggerItem
                as="li"
                key={o.id}
                className="group grid grid-cols-1 gap-1 border-t border-line py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"
              >
                <span className="text-lg font-bold text-ink transition-transform duration-500 ease-brand group-hover:translate-x-1">
                  {o.name}
                </span>
                <span className="eyebrow text-gold">{o.post}</span>
                <span className="eyebrow text-text-muted">{o.status}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ))}
    </div>
  );
}
