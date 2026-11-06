"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Touch-first horizontal carousel for phones. Native scroll-snap does the
 * swiping; a slim progress bar and counter show where you are. Items bleed to
 * the screen edge so the next card peeks in, inviting a swipe.
 */
export function SwipeRail({
  children,
  label,
  itemClassName,
  className,
  tone = "light",
  showCounter = true,
}: {
  children: ReactNode;
  /** Accessible name for the scroll region. */
  label: string;
  /** Width / sizing classes for each slide. */
  itemClassName?: string;
  className?: string;
  tone?: "light" | "dark";
  showCounter?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const i = max > 0 && el.scrollLeft >= max - 4 ? items.length - 1 : Math.round(el.scrollLeft / step);
    setActive(Math.min(items.length - 1, Math.max(0, i)));
  }, [items.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  const dark = tone === "dark";
  const visibleShare = items.length > 0 ? Math.min(1, 1.35 / items.length) : 1;

  return (
    <div className={className}>
      <ul
        ref={ref}
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {items.map((child, i) => (
          <li
            key={i}
            className={cn("shrink-0 snap-start", itemClassName)}
          >
            {child}
          </li>
        ))}
      </ul>

      {items.length > 1 ? (
        <div className="mt-5 flex items-center gap-4" aria-hidden>
          <div className={cn("relative h-[2px] flex-1 overflow-hidden rounded-full", dark ? "bg-white/15" : "bg-ink/10")}>
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-gold transition-[left] duration-150 ease-out"
              style={{
                width: `${visibleShare * 100}%`,
                left: `${progress * (1 - visibleShare) * 100}%`,
              }}
            />
          </div>
          {showCounter ? (
            <span className={cn("font-mono text-[11px] tabular-nums tracking-[0.12em]", dark ? "text-white/55" : "text-text-muted")}>
              <span className={dark ? "text-white" : "text-ink"}>{String(active + 1).padStart(2, "0")}</span>
              {" / "}
              {String(items.length).padStart(2, "0")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
