"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ExecutiveCard } from "@/components/ui/ExecutiveCard";
import type { Executive } from "@/types";

interface HomeExecutivesCarouselProps {
  executives: Executive[];
}

export function HomeExecutivesCarousel({
  executives,
}: HomeExecutivesCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateNav = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);

    const images = el.querySelectorAll("img");
    images.forEach((img) => img.addEventListener("load", updateNav));

    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
      images.forEach((img) => img.removeEventListener("load", updateNav));
    };
  }, [executives, updateNav]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (executives.length === 0) return null;

  return (
    <div>
      {" "}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous executives"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-gold hover:bg-gold/10 disabled:pointer-events-none disabled:opacity-35"
          >
            <FiChevronLeft size={22} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next executives"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-gold hover:bg-gold/10 disabled:pointer-events-none disabled:opacity-35"
          >
            <FiChevronRight size={22} aria-hidden />
          </button>
        </div>

        <Link
          href="/executives"
          className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold tracking-wider text-primary shadow-sm transition-shadow hover:shadow-md"
        >
          View all officers
          <FiArrowRight size={16} aria-hidden />
        </Link>
      </div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Executive council carousel"
      >
        {executives.map((exec) => (
          <div
            key={exec.id}
            data-carousel-item
            className="w-[min(85vw,18rem)] shrink-0 snap-start sm:w-[17.5rem]"
          >
            <ExecutiveCard executive={exec} variant="officer" />
          </div>
        ))}
      </div>
    </div>
  );
}
