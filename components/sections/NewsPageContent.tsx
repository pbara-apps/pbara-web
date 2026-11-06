"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiInbox } from "react-icons/fi";
import { newsArticlePath } from "@/lib/api/news";
import { Breadcrumbs } from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ButtonLink } from "@/components/site/primitives";
import { cn } from "@/lib/cn";
import type { NewsItem } from "@/types";

const GRID_PER_PAGE = 4;
const RAIL_LIMIT = 5;
const FALLBACK_IMAGE = "/images/ra-parade.jpg";

/** Known categories, shown in this order before any new ones from the API. */
const KNOWN_CATEGORIES = [
  "Announcements",
  "Press Release",
  "Programs",
  "Drill & Discipline",
  "Events",
];

interface NewsPageContentProps {
  news: NewsItem[];
}

function Thumb({ item, className }: { item: NewsItem; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-mist", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image || FALLBACK_IMAGE}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-brand group-hover:scale-[1.04]"
      />
    </div>
  );
}

function Meta({
  item,
  className,
  compact = false,
}: {
  item: NewsItem;
  className?: string;
  /** Hide the read time on phones so the line fits once. */
  compact?: boolean;
}) {
  return (
    <p className={cn("eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-text-muted", className)}>
      <span className="text-gold">{item.category}</span>
      <span aria-hidden>·</span>
      <time>{item.date}</time>
      {item.readTime ? (
        <span className={cn("flex items-center gap-x-3", compact && "max-md:hidden")}>
          <span aria-hidden>·</span>
          <span>{item.readTime} min read</span>
        </span>
      ) : null}
    </p>
  );
}

export function NewsPageContent({ news }: NewsPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "all";
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      categoryParam === "all"
        ? news
        : news.filter((item) => item.category === categoryParam),
    [news, categoryParam],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: news.length };
    for (const item of news) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [news]);

  // Only offer categories that actually have stories (plus the active one).
  const categories = useMemo(() => {
    const present = Object.keys(categoryCounts).filter((k) => k !== "all");
    const ordered = [
      ...KNOWN_CATEGORIES.filter((c) => present.includes(c)),
      ...present.filter((c) => !KNOWN_CATEGORIES.includes(c)).sort(),
    ];
    if (categoryParam !== "all" && !ordered.includes(categoryParam)) {
      ordered.push(categoryParam);
    }
    return ordered;
  }, [categoryCounts, categoryParam]);

  const totalPages =
    filtered.length <= 5
      ? 1
      : 1 + Math.ceil((filtered.length - 5) / GRID_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const featured = safePage === 1 ? filtered[0] : null;
  const gridItems = useMemo(() => {
    const start = safePage === 1 ? 1 : 5 + (safePage - 2) * GRID_PER_PAGE;
    return filtered.slice(start, start + GRID_PER_PAGE);
  }, [filtered, safePage]);

  // Headlines below the grid: anything not already on screen.
  // When a category is selected, surface stories from the other topics instead.
  const isFiltered = categoryParam !== "all";
  const railItems = useMemo(() => {
    const visible = new Set(
      [featured?.id, ...gridItems.map((i) => i.id)].filter(Boolean),
    );
    const pool = isFiltered
      ? news.filter((n) => n.category !== categoryParam)
      : news;
    return pool.filter((n) => !visible.has(n.id)).slice(0, RAIL_LIMIT);
  }, [news, featured, gridItems, isFiltered, categoryParam]);
  const railTitle = isFiltered ? "From other topics" : "More headlines";

  const setCategory = useCallback(
    (key: string) => {
      setCurrentPage(1);
      const params = new URLSearchParams(searchParams.toString());
      if (key === "all") params.delete("category");
      else params.set("category", key);
      router.push(`/news${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document
      .getElementById("news-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Masthead */}
      <header className="bg-ivory pt-8 md:pt-16">
        <div className="container-site">
          <Breadcrumbs items={[{ label: "Newsroom" }]} />
          <div className="mt-8 flex flex-col justify-between gap-4 border-b-2 border-ink pb-5 md:mt-14 md:flex-row md:items-end md:gap-6 md:pb-6">
            <Reveal>
              <p className="eyebrow text-gold">The PBA RA Bulletin</p>
              <h1 className="mt-3 font-heading text-[clamp(3.25rem,17vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.055em] text-ink md:mt-4 md:text-[clamp(3.5rem,11vw,9rem)]">
                Newsroom
              </h1>
            </Reveal>
            <Reveal delay={0.1} className="max-w-sm md:text-right">
              <p className="text-[15px] leading-relaxed text-text-muted md:text-[16px]">
                Official announcements, program updates, and leadership insights
                from the Royal Ambassadors.
              </p>
            </Reveal>
          </div>
          <div className="eyebrow flex flex-wrap justify-between gap-2 py-3 text-text-muted">
            <span suppressHydrationWarning>{today}</span>
            <span>
              {news.length} {news.length === 1 ? "story" : "stories"}
            </span>
          </div>
        </div>
      </header>

      {/* Category bar */}
      <nav
        aria-label="News categories"
        className="sticky top-[72px] z-30 border-y border-line bg-ivory/90 backdrop-blur-xl"
      >
        <div className="container-site">
          <ul className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-3">
            {["all", ...categories].map((key) => {
              const active = categoryParam === key;
              return (
                <li key={key} className="shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                      setCategory(key);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
                      active ? "bg-ink text-white" : "text-text-muted hover:bg-white hover:text-ink",
                    )}
                  >
                    {key === "all" ? "All stories" : key}
                    <span
                      className={cn(
                        "rounded-full px-1.5 font-mono text-[11px] tabular-nums",
                        active ? "bg-white/15 text-white" : "bg-mist text-text-muted",
                      )}
                    >
                      {categoryCounts[key] ?? 0}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <section id="news-list" className="scroll-mt-36 bg-ivory pb-16 pt-6 md:pb-32 md:pt-16">
        <div className="container-site">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-20 text-center">
              <FiInbox size={32} className="mb-4 text-text-muted" aria-hidden />
              <h2 className="heading-sm text-ink">No stories in this category yet</h2>
              <p className="mt-2 text-sm text-text-muted">
                Check back soon, or browse all news in the meantime.
              </p>
              <button type="button" onClick={() => setCategory("all")} className="btn btn-navy mt-6">
                View all news
              </button>
            </div>
          )}

          {/* Lead story */}
          {featured && (
            <Reveal>
              <article className="group relative grid gap-5 md:gap-8 lg:grid-cols-12 lg:gap-12">
                <Thumb item={featured} className="-mx-5 aspect-square max-h-[26rem] sm:-mx-8 md:mx-0 md:aspect-[16/10] md:max-h-none md:rounded-xl lg:col-span-7" />
                <div className="flex flex-col lg:col-span-5 lg:py-4">
                  <p className="eyebrow text-text-muted">Lead story</p>
                  <h2 className="mt-3 font-heading text-[clamp(1.45rem,6.6vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink text-balance md:mt-5 md:text-[clamp(1.75rem,2.6vw,2.5rem)]">
                    <Link href={newsArticlePath(featured)} className="after:absolute after:inset-0">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-4 line-clamp-4 text-[16px] leading-relaxed text-text-muted md:mt-5 md:line-clamp-none md:text-[17px]">
                    {featured.excerpt}
                  </p>
                  <div className="mt-auto pt-6 md:pt-8">
                    <Meta item={featured} />
                    <p className="mt-4 border-t border-line pt-4 text-sm text-text-muted">
                      By <span className="font-semibold text-ink">{featured.author || "RA Editorial"}</span>
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          )}

          {/* Grid */}
          {gridItems.length > 0 ? (
            <Stagger
              className={cn(
                "grid gap-x-8 md:grid-cols-2 md:gap-y-14",
                featured && "mt-10 border-t-2 border-ink md:mt-20 md:border-t md:border-line md:pt-14",
              )}
            >
              {gridItems.map((item) => (
                <StaggerItem key={item.id}>
                  <article className="group relative grid grid-cols-[6rem_1fr] items-start gap-4 border-b border-line py-5 md:block md:border-0 md:py-0">
                    <Thumb item={item} className="aspect-square rounded-lg md:aspect-[16/10] md:rounded-xl" />
                    <div className="min-w-0">
                      <Meta item={item} compact className="text-[10px] md:mt-6 md:text-[11px]" />
                      <h3 className="mt-1.5 line-clamp-3 font-heading text-[17px] font-bold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-primary text-balance md:mt-3 md:line-clamp-none md:text-2xl md:leading-tight md:tracking-[-0.025em]">
                        <Link href={newsArticlePath(item)} className="after:absolute after:inset-0">
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-3 hidden line-clamp-2 text-[16px] leading-relaxed text-text-muted md:block">
                        {item.excerpt}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-between gap-2 border-t border-line pt-6 md:mt-16 md:pt-8" aria-label="News pagination">
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                aria-label="Newer stories"
                className="btn btn-outline max-sm:w-12 max-sm:px-0"
              >
                <FiArrowLeft className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Newer</span>
              </button>
              <ol className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                      aria-current={page === safePage ? "page" : undefined}
                      className={cn(
                        "h-10 w-10 rounded-full font-mono text-sm tabular-nums transition-colors",
                        page === safePage ? "bg-ink text-white" : "text-text-muted hover:bg-white hover:text-ink",
                      )}
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                aria-label="Older stories"
                className="btn btn-outline max-sm:w-12 max-sm:px-0"
              >
                <span className="hidden sm:inline">Older</span> <FiArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </nav>
          )}

          {/* Headlines + CTA */}
          <div className="mt-14 grid gap-10 md:mt-24 lg:grid-cols-12">
            {railItems.length > 0 ? (
              <Reveal className="lg:col-span-7">
                <div className="flex items-center justify-between border-b-2 border-ink pb-4">
                  <h2 className="eyebrow text-ink">{railTitle}</h2>
                  {isFiltered ? (
                    <button type="button" onClick={() => setCategory("all")} className="eyebrow text-primary hover:text-ink">
                      View all
                    </button>
                  ) : null}
                </div>
                <ol>
                  {railItems.map((item, idx) => (
                    <li key={item.id} className="border-b border-line">
                      <Link href={newsArticlePath(item)} className="group flex items-center gap-4 py-4 md:gap-6 md:py-5">
                        <span className="font-heading text-2xl font-extrabold tabular-nums tracking-[-0.04em] text-gold/60 transition-colors group-hover:text-gold md:text-3xl">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="eyebrow block text-text-muted">
                            {item.category} · {item.date}
                          </span>
                          <span className="mt-1.5 block font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                            {item.title}
                          </span>
                        </span>
                        <FiArrowUpRight className="h-5 w-5 shrink-0 text-text-muted transition-transform duration-300 group-hover:rotate-45 group-hover:text-ink" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : null}

            <Reveal delay={0.1} className={railItems.length > 0 ? "lg:col-span-5" : "lg:col-span-12"}>
              <div className="flex h-full flex-col justify-between gap-8 rounded-2xl bg-ink p-6 text-white md:gap-10 md:p-10">
                <div>
                  <p className="eyebrow text-gold">Stay in the loop</p>
                  <p className="mt-5 font-heading text-[28px] font-bold leading-tight tracking-[-0.03em]">
                    Camps, drills, competitions and more.
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/65">
                    See what&apos;s next for Royal Ambassadors, or send us a
                    story from your chapter.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <ButtonLink href="/events" variant="gold">Upcoming events</ButtonLink>
                  <ButtonLink href="/contact" variant="outline-light">Share a story</ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
