"use client";

import { useState } from "react";
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
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <ImageReveal className="aspect-[4/5] rounded-xl bg-[#d9dae6]">
                <PersonPhoto src={portrait} name={data.name} />
              </ImageReveal>
              <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-5 px-6">
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
              <Eyebrow index={index}>The Director&apos;s desk</Eyebrow>
              <h2
                id={`${id}-heading`}
                className="display-md mt-6 text-balance text-ink"
              >
                {heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="relative mt-10">
              <span
                aria-hidden
                className="absolute -left-2 -top-16 select-none font-heading text-[9rem] font-extrabold leading-none text-gold/25 md:-left-10"
              >
                “
              </span>
              <div className="relative whitespace-pre-line text-[19px] leading-[1.75] text-[#23264f] md:text-[21px] text-pretty">
                {shown}
              </div>

              {isLong && compact ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="mt-6 text-sm font-semibold text-primary underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-ink"
                >
                  {expanded ? "Show less" : "Continue reading"}
                </button>
              ) : null}

              <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
                <div>
                  <p className="font-heading text-2xl font-bold italic tracking-[-0.02em] text-primary">
                    {data.name}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Director, Pentecost Baptist Association Royal Ambassadors
                  </p>
                </div>
                {compact ? (
                  <ArrowLink href="/about#director">Read on the About page</ArrowLink>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
