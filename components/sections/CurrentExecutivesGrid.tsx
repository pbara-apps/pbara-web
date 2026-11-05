"use client";

import { useMemo } from "react";
import { ExecutiveCard } from "@/components/ui/ExecutiveCard";
import { PersonPhoto } from "@/components/site/PersonPhoto";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { useGetPublicExecutives } from "@/service/apis/executive";
import { executives as fallbackExecutives } from "@/data/executives";
import { formatChurchName } from "@/lib/format";
import type { Executive } from "@/types";

const nameKey = (name: string) =>
  name.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();

function bundledPortrait(name: string) {
  const key = nameKey(name);
  const match = fallbackExecutives.find((f) => {
    const k = nameKey(f.name);
    return f.image && (key === k || key.startsWith(`${k} `));
  });
  return match?.image ?? null;
}

function isDirector(e: Executive) {
  return /^director$/i.test(e.position.trim());
}

/**
 * Executive council from the admin portal, falling back to the bundled list
 * only if the API is unreachable. The Director is always listed first.
 */
export function useExecutives() {
  const { data, isLoading, isError } = useGetPublicExecutives();
  const list = useMemo(() => {
    const source =
      data && data.length > 0 ? data : isError ? fallbackExecutives : (data ?? []);
    const normalised = source.map((e) => ({
      ...e,
      // Admin records without a portrait reuse the bundled photo for the same person.
      image: e.image || bundledPortrait(e.name),
      church: formatChurchName(e.church),
    }));
    const director = normalised.find(isDirector);
    return director
      ? [director, ...normalised.filter((e) => e !== director)]
      : normalised;
  }, [data, isError]);

  return {
    executives: list,
    director: list.find(isDirector) ?? null,
    isLoading: isLoading && !data,
  };
}

export function ExecutivesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] animate-pulse rounded-lg bg-mist" />
          <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-mist" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-mist" />
        </div>
      ))}
    </div>
  );
}

/** Wide editorial card for the Director. */
export function DirectorFeature({ director }: { director: Executive }) {
  return (
    <article className="grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-12">
      <ImageReveal className="aspect-[4/5] md:col-span-5 md:aspect-auto md:min-h-[30rem]">
        <PersonPhoto src={director.image} name={director.name} />
      </ImageReveal>
      <div className="flex flex-col justify-between gap-10 p-8 md:col-span-7 md:p-12">
        <p className="eyebrow text-gold">Director · Executive council</p>
        <div>
          <h3 className="display-md text-balance">{director.name}</h3>
          {director.church ? (
            <p className="mt-4 text-white/60">{director.church}</p>
          ) : null}
        </div>
        <p className="max-w-md border-t border-white/10 pt-6 text-[15px] leading-relaxed text-white/70">
          The Director leads the association&apos;s executive council and
          oversees the work of Royal Ambassadors across every chapter.
        </p>
      </div>
    </article>
  );
}

/** Full council for the /executives page. */
export function CurrentExecutivesGrid() {
  const { executives, director, isLoading } = useExecutives();

  if (isLoading) return <ExecutivesSkeleton count={8} />;

  if (executives.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-6 py-14 text-center text-sm text-text-muted">
        Executive officers will appear here once published from the admin portal.
      </p>
    );
  }

  const others = executives.filter((e) => e !== director);

  return (
    <div className="space-y-16">
      {director ? (
        <Reveal>
          <DirectorFeature director={director} />
        </Reveal>
      ) : null}
      <Stagger className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {others.map((exec) => (
          <StaggerItem key={exec.id}>
            <ExecutiveCard executive={exec} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
