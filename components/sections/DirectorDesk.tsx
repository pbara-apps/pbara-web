"use client";

import Link from "next/link";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { ImageReveal, Reveal } from "@/components/site/motion";
import { ArrowLink, Eyebrow } from "@/components/site/primitives";
import { PersonPhoto } from "@/components/site/PersonPhoto";

type DirectorDeskData = {
  name: string;
  title: string;
  description: string;
  image?: string | null;
};

const PREVIEW_CHARS = 520;

/**
 * Editorial letter from the Director. `compact` (homepage) clamps long
 * messages and links to the full letter on the About page.
 */
export function DirectorDesk({
  data,
  compact = false,
  id = "director",
  index = "04",
}: {
  data: DirectorDeskData;
  compact?: boolean;
  id?: string;
  index?: string;
}) {
  const portrait = data.image || "/images/ik.png";
  const message = data.description.trim();
  const isLong = message.length > PREVIEW_CHARS;
  const [expanded, setExpanded] = useState(!compact);
  const shown =
    isLong && !expanded
      ? `${message.slice(0, PREVIEW_CHARS).replace(/\s+\S*$/, "")}…`
      : message;
  const heading = data.title?.trim() || "From the Director's Desk";

  return (
    <section
      id={id}
      className="section-y relative overflow-hidden bg-ivory"
      aria-labelledby={`${id}-heading`}
    >
      <div className="container-site">
        <div className="grid gap-10 md:gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="relative -mx-5 sm:-mx-8 md:mx-0 lg:sticky lg:top-28">
              <ImageReveal className="aspect-[4/5] bg-[#d9dae6] max-md:max-h-[34rem] max-md:w-full md:rounded-xl">
                <PersonPhoto src={portrait} name={data.name} />
              </ImageReveal>
              {/* Phones: magazine cover treatment with the byline on the portrait. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent md:hidden" />
              <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-8 md:hidden">
                <p className="eyebrow flex items-center gap-2.5 text-gold">
                  <span className="tabular-nums">{index}</span>
                  <span className="text-white/75">The Director&apos;s desk</span>
                </p>
                <p className="mt-3 font-heading text-[26px] font-extrabold leading-[1.05] tracking-[-0.03em]">
                  {data.name}
                </p>
                <p className="mt-1 text-[13px] text-white/70">Director, PBA Royal Ambassadors</p>
              </div>
              <div className="mt-5 hidden items-start justify-between gap-4 border-t border-line px-6 pt-5 md:flex">
                {
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-1">
                    <div className={`w-2 h-12 bg-primary`}/>
                     <div className="w-2 h-12 bg-white shadow border"/>
                     <div className="w-2 h-12 bg-gold"/>
                    </div>
                  ))
                }
               
              </div>
            </div>
          </div>

          {/* Letter */}
          <div className="lg:col-span-7 lg:pt-6">
            <Reveal>
              <Eyebrow index={index} className="hidden md:flex">The Director&apos;s desk</Eyebrow>
              <h2
                id={`${id}-heading`}
                className="display-md text-[clamp(1.85rem,8.4vw,2.5rem)] text-balance text-ink md:mt-6 md:text-[clamp(1.875rem,3.4vw,3rem)]"
              >
                {heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="relative mt-6 md:mt-10">
              <span
                aria-hidden
                className="absolute -left-2 -top-16 hidden select-none font-heading text-[9rem] font-extrabold leading-none text-gold/25 md:-left-10 md:block"
              >
                “
              </span>
              <div
                className={cn(
                  "relative whitespace-pre-line border-l-2 border-gold pl-5 text-[17px] leading-[1.7] text-[#23264f] text-pretty md:border-l-0 md:pl-0 md:text-[21px] md:leading-[1.75]",
                  compact && !expanded && "max-md:line-clamp-6",
                )}
              >
                {shown}
              </div>

              {compact ? (
                <Link
                  href="/about#director"
                  className="group mt-6 inline-flex min-h-[48px] w-full items-center justify-between rounded-full bg-ink px-6 text-[14px] font-semibold text-white md:hidden"
                >
                  Read the full letter
                  <FiArrowRight className="h-4 w-4 transition-transform group-active:translate-x-1" aria-hidden />
                </Link>
              ) : null}

              {isLong && compact ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="mt-6 hidden text-sm font-semibold text-primary underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-ink md:inline"
                >
                  {expanded ? "Show less" : "Continue reading"}
                </button>
              ) : null}

              <div className={cn("mt-12 flex-wrap items-center justify-between gap-6 border-t border-line pt-8", "hidden md:flex")}>
                <div>
                  <p className="font-heading text-2xl font-bold italic tracking-[-0.02em] text-primary">
                    {data.name}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Director, Pentecost Baptist Association Royal Ambassadors
                  </p>
                </div>
                {compact ? (
                  <ArrowLink href="/about#director" className="hidden md:inline-flex">Read on the About page</ArrowLink>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
