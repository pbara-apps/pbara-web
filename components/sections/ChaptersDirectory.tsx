"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { ChapterCard } from "@/components/ui/ChapterCard";
import { Reveal } from "@/components/site/motion";
import { ButtonLink } from "@/components/site/primitives";
import { chapters as fallbackChapters } from "@/data/chapters";
import { useGetPublicChapters } from "@/service/apis/church";
import { formatChurchName } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Chapter } from "@/types";

/** Chapters from the admin portal (bundled list only if the API fails). */
export function useChapters() {
  const { data, isLoading, isError } = useGetPublicChapters();
  const chapters = useMemo<Chapter[]>(() => {
    const source =
      data && data.length > 0 ? data : isError ? fallbackChapters : (data ?? []);
    return source.map((c) => ({ ...c, churchName: formatChurchName(c.churchName) }));
  }, [data, isError]);
  return { chapters, isLoading: isLoading && !data };
}

type StatusFilter = "all" | "active" | "inactive";

function matchesQuery(c: Chapter, q: string) {
  if (!q) return true;
  const hay = [c.chapterName, c.churchName, c.address, c.commander]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((part) => hay.includes(part));
}

export function ChaptersDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState<StatusFilter>("all");
  const { chapters, isLoading } = useChapters();

  const hasInactive = chapters.some((c) => c.status === "inactive");
  const filtered = chapters.filter(
    (c) => matchesQuery(c, query.trim()) && (status === "all" || c.status === status),
  );

  const updateQuery = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-[72px] z-30 -mx-5 border-b border-line bg-ivory/90 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:mx-0 lg:rounded-xl lg:border lg:px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-md">
            <span className="sr-only">Search chapters</span>
            <FiSearch
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search by chapter, church or location"
              className="field rounded-full pl-11 pr-11"
            />
            {query ? (
              <button
                type="button"
                onClick={() => updateQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-text-muted hover:bg-mist hover:text-ink"
              >
                <FiX className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </label>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            {hasInactive ? (
              <div className="flex rounded-full bg-white p-1 ring-1 ring-line" role="group" aria-label="Filter by status">
                {(["all", "active", "inactive"] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={status === s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition-colors",
                      status === s ? "bg-ink text-white" : "text-text-muted hover:text-ink",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            <p className="eyebrow whitespace-nowrap text-text-muted" aria-live="polite">
              {isLoading
                ? "Loading…"
                : `${filtered.length} of ${chapters.length} chapters`}
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-mist" />
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-6 py-14 text-center text-sm text-text-muted">
            Chapters will appear here once registered in the admin portal.
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
            <p className="heading-sm text-ink">No chapters match “{query}”</p>
            <p className="mt-2 text-sm text-text-muted">
              Try a different spelling, or clear the search to see every chapter.
            </p>
            <button
              type="button"
              onClick={() => {
                updateQuery("");
                setStatus("all");
              }}
              className="btn btn-outline mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" key={`${query}-${status}`}>
            {filtered.map((chapter, i) => (
              <Reveal key={chapter.id} className="h-full" y={20} delay={(i % 3) * 0.06}>
                <ChapterCard
                  chapter={chapter}
                  index={chapters.indexOf(chapter) + 1}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Invitation */}
      <Reveal className="mt-24">
        <div className="grain relative grid overflow-hidden rounded-2xl bg-ink px-8 py-14 text-white md:grid-cols-12 md:items-end md:px-14 md:py-16">
          <div className="md:col-span-8">
            <p className="eyebrow text-gold">Not listed?</p>
            <h2 className="display-md mt-5 max-w-2xl text-balance">
              Don&apos;t see your chapter?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
              If your local church has an RA unit that is not listed here,
              contact the association secretariat to register your chapter.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 md:col-span-4 md:mt-0 md:items-end">
            <ButtonLink href="/contact" variant="gold">
              Get in touch with secretariat
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </>
  );
}
