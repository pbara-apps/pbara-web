"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiFilter,
  FiBell,
  FiCalendar,
  FiBookOpen,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiMail,
  FiInbox,
} from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { MdMilitaryTech } from "react-icons/md";
import { newsArticlePath } from "@/lib/api/news";
import type { NewsItem } from "@/types";

const GRID_PER_PAGE = 4;
const RAIL_LIMIT = 5;

const CATEGORIES = [
  { key: "all", label: "All News", icon: HiOutlineNewspaper },
  { key: "Announcements", label: "Announcements", icon: FiBell },
  { key: "Press Release", label: "Press Release", icon: HiOutlineMegaphone },
  { key: "Programs", label: "Programs", icon: FiCalendar },
  { key: "Drill & Discipline", label: "Drill & Discipline", icon: MdMilitaryTech },
] as const;

// Sidebars stick just below the sticky navbar and scroll on their own if taller than the viewport.
const STICKY_RAIL = "xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto";

interface NewsPageContentProps {
  news: NewsItem[];
}

function newsImageSrc(image?: string) {
  return image || "/images/ra-logo.png";
}

function BulletinCard() {
  return (
    <div className="rounded-xl bg-slate-900 p-6 text-white overflow-hidden relative">
      <div className="relative z-10">
        <h4 className="font-bold mb-2">Quarterly Bulletin</h4>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Download the latest issue of our national newsletter for Royal
          Ambassadors.
        </p>
        <a
          href="/downloads/quarterly-bulletin.pdf"
          download
          className="block w-full bg-primary py-2 text-xs font-bold rounded hover:bg-primary/80 transition-colors text-center"
        >
          Download PDF
        </a>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10" aria-hidden>
        <FiBookOpen size={96} />
      </div>
    </div>
  );
}

function HeadlineList({ items }: { items: NewsItem[] }) {
  return (
    <ol className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
      {items.map((item, idx) => (
        <li key={item.id}>
          <Link
            href={newsArticlePath(item)}
            className="group flex gap-3 py-4 first:pt-0"
          >
            <span className="font-serif text-2xl font-black leading-none text-slate-200 dark:text-slate-700 tabular-nums w-7 shrink-0 group-hover:text-primary/40 transition-colors">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                {item.category}
              </span>
              <h4 className="text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <span className="mt-1 block text-[11px] text-slate-400">
                {item.date}
              </span>
            </div>
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <Image
                src={newsImageSrc(item.image)}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="56px"
              />
            </div>
          </Link>
        </li>
      ))}
    </ol>
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

  // Headlines for the right rail: anything not already on screen.
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
  const railTitle = isFiltered ? "From Other Topics" : "More Headlines";

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
    const content = document.getElementById("news-list");
    content?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="mx-auto grid w-full max-w-[90rem] grow grid-cols-1 items-start gap-8 px-4 py-10 sm:px-6 md:grid-cols-[14rem_minmax(0,1fr)] lg:px-10 xl:grid-cols-[15rem_minmax(0,1fr)_19rem] xl:gap-10">
      {/* Sidebar Navigation */}
      <aside
        className="sticky top-16 z-30 -mx-4 flex flex-col gap-8 border-b border-slate-200/70 bg-background/95 py-3 backdrop-blur sm:-mx-6 md:top-24 md:z-auto md:mx-0 md:self-start md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:border-0 md:bg-transparent md:py-0 md:backdrop-blur-none"
        aria-label="News categories"
      >
        <div className="flex flex-col gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiFilter size={20} aria-hidden />
            </div>
            <div>
              <h3 className="text-base font-semibold">Categories</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filter news by topic
              </p>
            </div>
          </div>
          {/* Horizontal chips on mobile, vertical list from md up */}
          <div className="flex snap-x gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 md:flex-col md:gap-1 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => {
              const isActive = categoryParam === c.key;
              const Icon = c.icon;
              const count = categoryCounts[c.key] ?? 0;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={(e) => {
                    // Keep the tapped chip visible in the mobile scroll row
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center",
                    });
                    setCategory(c.key);
                  }}
                  aria-pressed={isActive}
                  className={`group relative flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border bg-white px-4 py-2.5 text-left dark:bg-slate-900 md:gap-3 md:bg-transparent dark:md:bg-transparent text-sm transition-colors md:rounded-lg md:border-transparent md:px-3 md:py-2.5 ${
                    isActive
                      ? "border-primary bg-primary/10 font-semibold text-primary md:bg-slate-200 dark:md:bg-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 hidden w-0.5 rounded-full bg-primary md:block"
                      aria-hidden
                    />
                  )}
                  <Icon size={20} className="shrink-0" aria-hidden />
                  <span className="md:flex-1">{c.label}</span>
                  <span
                    className={`hidden md:inline-flex min-w-6 justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="hidden md:block">
          <BulletinCard />
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="min-w-0 scroll-mt-36 md:scroll-mt-24" id="news-list">
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Latest News and Press
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Official announcements, program updates, and leadership insights
            from the Royal Ambassadors paramilitary Christian youth
            organization.
          </p>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-6 py-16 text-center">
            <FiInbox size={36} className="mb-3 text-slate-300" aria-hidden />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
              No stories in this category yet
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Check back soon, or browse all news in the meantime.
            </p>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className="mt-5 rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/80 transition-colors"
            >
              View all news
            </button>
          </div>
        )}

        {/* Featured Article */}
        {featured && (
          <article className="group relative mb-8 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={newsImageSrc(featured.image)}
                alt={
                  featured.image
                    ? `${featured.title} — Royal Ambassadors`
                    : "Royal Ambassadors logo"
                }
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
              />
              <span className="absolute left-4 top-4 rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                Featured
              </span>
            </div>
            <div className="flex flex-col p-5 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">
                  {featured.category}
                </span>
                <span className="text-slate-300" aria-hidden>
                  |
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {featured.date}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed max-w-3xl">
                {featured.excerpt}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"
                    aria-label={
                      featured.author
                        ? `Headshot of ${featured.author}`
                        : undefined
                    }
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {featured.author ?? "RA Editorial"}
                  </span>
                </div>
                <Link
                  href={newsArticlePath(featured)}
                  className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider group/btn"
                >
                  Read Full Report
                  <FiArrowRight
                    size={18}
                    className="transition-transform group-hover/btn:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {gridItems.map((item, idx) => {
            const ctaLabels = ["Details", "Read", "Full Story", "Update"];
            const cta = ctaLabels[idx] ?? "Read";

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={newsImageSrc(item.image)}
                    alt={
                      item.image
                        ? `${item.title} — Royal Ambassadors`
                        : "Royal Ambassadors logo"
                    }
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col h-full">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400 italic">
                      {item.date} • {item.readTime ?? 3} min read
                    </span>
                    <Link
                      href={newsArticlePath(item)}
                      className="text-primary text-sm font-bold uppercase"
                    >
                      {cta}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            aria-label="News pagination"
          >
            <button
              type="button"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage <= 1}
              className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <FiChevronLeft size={18} aria-hidden />
            </button>
            {totalPages <= 5 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === safePage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 rounded font-bold text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handlePageChange(1)}
                  className={`h-10 w-10 rounded font-bold text-sm transition-colors ${
                    safePage === 1
                      ? "bg-primary text-white"
                      : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                  aria-current={safePage === 1 ? "page" : undefined}
                >
                  1
                </button>
                {[2, 3].map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 rounded font-bold text-sm transition-colors ${
                      safePage === page
                        ? "bg-primary text-white"
                        : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                    aria-current={safePage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-slate-400" aria-hidden>
                  ...
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages)}
                  className={`h-10 w-10 rounded font-bold text-sm transition-colors ${
                    safePage === totalPages
                      ? "bg-primary text-white"
                      : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                  aria-current={safePage === totalPages ? "page" : undefined}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <FiChevronRight size={18} aria-hidden />
            </button>
          </nav>
        )}

        {/* Below xl the right rail is hidden, so show its content here instead */}
        <div className="mt-14 flex flex-col gap-6 xl:hidden">
          {railItems.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <FiTrendingUp size={16} className="text-primary" aria-hidden />
                {railTitle}
              </h3>
              <HeadlineList items={railItems} />
            </div>
          )}
          <div className="md:hidden">
            <BulletinCard />
          </div>
        </div>
      </section>

      {/* Right Rail: related / other news */}
      <aside
        className={`hidden xl:flex flex-col gap-6 ${STICKY_RAIL}`}
        aria-label={railTitle}
      >
        {railItems.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <FiTrendingUp size={16} className="text-primary" aria-hidden />
                {railTitle}
              </h3>
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  View all
                </button>
              )}
            </div>
            <HeadlineList items={railItems} />
          </div>
        )}

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 dark:border-primary/30 dark:bg-primary/10">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Stay in the loop
          </h3>
          <p className="mt-1 mb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Camps, drills, conventions and more. See what&apos;s next for Royal
            Ambassadors, or send us a story from your chapter.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/events"
              className="group/link flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:text-primary dark:bg-slate-900 dark:text-slate-100"
            >
              <span className="flex items-center gap-2">
                <FiCalendar size={16} className="text-primary" aria-hidden />
                Upcoming events
              </span>
              <FiArrowRight
                size={16}
                className="transition-transform group-hover/link:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="group/link flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:text-primary dark:bg-slate-900 dark:text-slate-100"
            >
              <span className="flex items-center gap-2">
                <FiMail size={16} className="text-primary" aria-hidden />
                Share a story
              </span>
              <FiArrowRight
                size={16}
                className="transition-transform group-hover/link:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </aside>
    </main>
  );
}
