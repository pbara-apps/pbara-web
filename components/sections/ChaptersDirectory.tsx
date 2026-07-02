"use client";

import { Spinner } from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { ChapterCard } from "@/components/ui/ChapterCard";
import { chapters as fallbackChapters } from "@/data/chapters";
import { useGetPublicChapters } from "@/service/apis/church";
import type { Chapter } from "@/types";

type UnitFilter = "all" | "primary" | "junior" | "senior";

function filterChapters(chaptersList: Chapter[], filter: UnitFilter): Chapter[] {
  if (filter === "all") return chaptersList;
  return chaptersList.filter((c) => c.unit === filter);
}

const TABS: { key: UnitFilter; label: string }[] = [
  { key: "all", label: "All Chapters" },
];

export function ChaptersDirectory() {
  const [filter, setFilter] = useState<UnitFilter>("all");
  const { data, isLoading, isError } = useGetPublicChapters();
  const source =
    data && data.length > 0 ? data : isError ? fallbackChapters : data ?? [];
  const filtered = filterChapters(source, filter);

  return (
    <>
      <div
        className="mb-10 border-b border-slate-200 dark:border-slate-800"
        role="tablist"
        aria-label="Filter chapters by unit type"
      >
        <div className="flex flex-wrap gap-8">
          {TABS.map(({ key, label }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(key)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 transition-colors ${
                  isActive
                    ? "border-primary text-navy-deep dark:text-white"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-primary"
                }`}
              >
                <span className="text-sm font-bold uppercase tracking-wider">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex justify-center py-16">
          <Spinner color="primary" size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          Chapters will appear here once registered in the admin portal.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      )}

      <div className="mt-20">
        <div className="flex flex-col items-center justify-center gap-8 px-6 py-16 rounded-xl bg-navy-deep text-white text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div className="relative z-10 flex flex-col gap-4 items-center">
            <HiOutlineBuildingOffice2
              size={48}
              className="text-accent-gold shrink-0"
              aria-hidden
            />
            <h2 className="tracking-tight text-3xl md:text-4xl font-black max-w-[720px]">
              Don&apos;t see your chapter?
            </h2>
            <p className="text-slate-300 text-lg font-normal max-w-[600px]">
              If your local church has an RA unit but it is not listed here,
              please contact the Association Commander to register your unit
              today.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-accent-gold text-navy-deep text-base font-bold shadow-lg hover:shadow-accent-gold/30 transition-all"
            >
              <span>Register Chapter</span>
            </Link>
            <Link
              href="/contact"
              className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 border-2 border-slate-600 text-white text-base font-bold hover:bg-slate-800 transition-all"
            >
              <span>Contact Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
