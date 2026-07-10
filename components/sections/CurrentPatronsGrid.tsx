"use client";

import { Spinner, cn } from "@heroui/react";
import { FiAward } from "react-icons/fi";
import { patrons as fallbackPatrons } from "@/data/patrons";
import { useGetPublicPatrons } from "@/service/apis/patron";

export function CurrentPatronsGrid() {
  const { data, isLoading, isError } = useGetPublicPatrons();
  const list =
    data && data.length > 0 ? data : isError ? fallbackPatrons : (data ?? []);

  if (isLoading && !data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
        Patrons will appear here once published from the admin portal.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      {list.map((patron) => (
        <div
          key={patron.id}
          className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row"
        >
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-primary/20 md:h-40 md:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={patron.image ?? "/images/ra-logo.png"}
              alt={patron.name}
              className={cn(
                "h-full w-full object-cover",
                !patron.image && "grayscale",
              )}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {patron.name}
            </h3>
            <p className="mb-3 text-sm font-bold uppercase text-primary">
              {patron.role}
            </p>
            <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">
              &quot;{patron.quote}&quot;
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PatronsSection() {
  return (
    <section className="mb-20" aria-labelledby="patrons-heading">
      <div className="mb-8 space-y-1">
        <div className="flex items-center gap-3">
          <FiAward size={32} className="shrink-0 text-primary" aria-hidden />
          <h2
            id="patrons-heading"
            className="text-3xl font-bold text-slate-900 dark:text-slate-100"
          >
            Our Patrons
          </h2>
        </div>
        <p className="ps-2 text-base text-slate-600 dark:text-slate-400">
          Dignified elders and leaders providing spiritual guidance and support
          to the association.
        </p>
      </div>
      <CurrentPatronsGrid />
    </section>
  );
}
