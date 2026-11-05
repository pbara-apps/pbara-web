"use client";

import { useState } from "react";
import { FiMapPin, FiUser } from "react-icons/fi";
import type { Chapter } from "@/types";
import { cn } from "@/lib/cn";
import { isMeaningfulName } from "@/lib/format";

interface ChapterCardProps {
  chapter: Chapter;
  /** Position in the full directory, shown as a 2-digit index. */
  index?: number;
}

export function ChapterCard({ chapter, index }: ChapterCardProps) {
  const initial = chapter.chapterName.replace(/^(the|fbc)\s+/i, "").charAt(0);
  const counsellor = isMeaningfulName(chapter.commander) ? chapter.commander : null;
  const active = chapter.status === "active";
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(chapter.image) && !imageFailed;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[box-shadow,transform,border-color] duration-500 ease-brand hover:-translate-y-1 hover:border-transparent hover:shadow-[0_30px_60px_-30px_rgba(5,6,31,0.35)]">
      <div className={cn("relative overflow-hidden bg-primary", showImage ? "aspect-[16/9]" : "h-28 sm:h-auto sm:aspect-[16/9]")}>
        {showImage ? (
          // Chapter photos come from admin uploads on various hosts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={chapter.image}
            alt={`${chapter.churchName} — ${chapter.chapterName}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-brand group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 16px)",
              }}
            />
            <span className="absolute -bottom-8 right-4 font-heading text-[9rem] font-extrabold leading-none tracking-[-0.06em] text-white/[0.08] transition-transform duration-700 ease-brand group-hover:-translate-y-2">
              {initial}
            </span>
          </div>
        )}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          {index ? (
            <span className="rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[11px] tabular-nums text-white backdrop-blur-md">
              {String(index).padStart(2, "0")}
            </span>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "eyebrow flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-md",
              active ? "bg-white/90 text-ink" : "bg-ink/60 text-white/70",
            )}
          >
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-white/40")}
            />
            {active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-[21px] font-bold leading-tight tracking-[-0.02em] text-ink">
          {chapter.chapterName}
        </h3>
        <p className="mt-1.5 text-[15px] text-text-muted">{chapter.churchName}</p>

        {(chapter.address || counsellor) && (
          <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
            {chapter.address ? (
              <div className="flex items-start gap-2.5">
                <dt className="sr-only">Location</dt>
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd className="text-ink/80">{chapter.address}</dd>
              </div>
            ) : null}
            {counsellor ? (
              <div className="flex items-start gap-2.5">
                <dt className="sr-only">Counsellor</dt>
                <FiUser className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd className="text-ink/80">
                  <span className="text-text-muted">Counsellor · </span>
                  {counsellor}
                </dd>
              </div>
            ) : null}
          </dl>
        )}
      </div>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[3px] w-0 bg-gold transition-[width] duration-700 ease-brand group-hover:w-full"
      />
    </article>
  );
}
