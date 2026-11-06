"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeExecutivesCarousel } from "@/components/sections/HomeExecutivesCarousel";
import {
  ExecutivesSkeleton,
  useExecutives,
} from "@/components/sections/CurrentExecutivesGrid";
import { useChapters } from "@/components/sections/ChaptersDirectory";
import { Parallax, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ArrowLink, ButtonLink, Eyebrow } from "@/components/site/primitives";
import { PersonPhoto } from "@/components/site/PersonPhoto";
import { SwipeRail } from "@/components/site/SwipeRail";
import { FiArrowRight, FiArrowUpRight, FiSearch } from "react-icons/fi";
import type { Executive } from "@/types";
import { newsArticlePath } from "@/lib/api/news";
import type { NewsItem } from "@/types";

const NEWS_FALLBACK_IMAGE = "/images/ra-parade.jpg";

/* ───────────────────────── Leadership ───────────────────────── */

/** Phones: Director as a cover portrait, the rest of the council in a rail. */
function MobileLeadership({
  executives,
  director,
}: {
  executives: Executive[];
  director: Executive | null;
}) {
  const others = executives.filter((e) => e !== director);
  return (
    <div className="md:hidden">
      {director ? (
        <Reveal>
          <article className="grid grid-cols-[42%_1fr] overflow-hidden rounded-xl bg-ink text-white">
            <div className="relative aspect-[3/4]">
              <PersonPhoto src={director.image} name={director.name} logoClassName="w-[50%]" />
            </div>
            <div className="flex min-w-0 flex-col justify-between p-4 min-[400px]:p-5">
              <p className="eyebrow text-[10px] text-gold">Director</p>
              <div>
                <h3 className="font-heading text-[19px] font-extrabold leading-[1.08] tracking-[-0.025em] min-[400px]:text-[21px]">
                  {director.name}
                </h3>
                {director.church ? (
                  <p className="mt-2 text-[13px] leading-snug text-white/60">{director.church}</p>
                ) : null}
              </div>
              <p className="border-t border-white/10 pt-3 text-[12.5px] leading-snug text-white/55">
                Leads the executive council across every chapter.
              </p>
            </div>
          </article>
        </Reveal>
      ) : null}

      {others.length > 0 ? (
        <Reveal delay={0.05} className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="eyebrow text-ink">Council officers</p>
            <p className="eyebrow text-text-muted">{others.length} officers</p>
          </div>
          <SwipeRail label="Executive council officers" itemClassName="w-[46%] max-w-[12rem]">
            {others.map((exec) => (
              <article key={exec.id}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-mist">
                  <PersonPhoto src={exec.image} name={exec.name} logoClassName="w-[40%]" />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-gold" />
                </div>
                <p className="eyebrow mt-3 line-clamp-1 text-[10px] text-gold">{exec.position || "Officer"}</p>
                <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-ink">{exec.name}</h3>
              </article>
            ))}
          </SwipeRail>
        </Reveal>
      ) : null}

      <Link
        href="/executives"
        className="group mt-8 flex min-h-[52px] items-center justify-between rounded-full border border-ink/15 px-6 text-[14px] font-semibold text-ink active:bg-mist"
      >
        Full leadership directory
        <FiArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export function HomeLeadership() {
  const { executives, director, isLoading } = useExecutives();

  return (
    <section className="section-y overflow-hidden bg-white" aria-labelledby="leadership-heading">
      <div className="container-site">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="05">Leadership</Eyebrow>
            <h2 id="leadership-heading" className="display-md mt-6 text-balance text-ink">
              The Executive Council
            </h2>
            <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-text-muted md:mt-6 md:text-[17px]">
              Officers entrusted with the spiritual and social development of
              every ambassador in the association.
            </p>
            <ArrowLink href="/executives" className="mt-6 hidden md:inline-flex">
              Meet the full council
            </ArrowLink>
          </Reveal>

          {isLoading ? (
            <div className="md:hidden">
              <ExecutivesSkeleton count={2} />
            </div>
          ) : (
            <MobileLeadership executives={executives} director={director} />
          )}

          <Reveal delay={0.1} className="hidden min-w-0 md:block lg:col-span-8">
            {isLoading ? (
              <ExecutivesSkeleton count={3} />
            ) : (
              <HomeExecutivesCarousel executives={executives} />
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Chapters index ───────────────────────── */

const CHAPTER_PREVIEW = 12;
/** Phones show a shorter index; the search box covers the rest. */
const CHAPTER_PREVIEW_MOBILE = 6;

export function HomeChapters() {
  const { chapters, isLoading } = useChapters();
  const preview = chapters.slice(0, CHAPTER_PREVIEW);
  const remaining = chapters.length - preview.length;
  const remainingMobile = chapters.length - Math.min(chapters.length, CHAPTER_PREVIEW_MOBILE);

  return (
    <section className="grain relative overflow-hidden bg-ink text-white" aria-labelledby="chapters-heading">
      <div className="container-site section-y relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow index="06" tone="dark">
              Chapters
            </Eyebrow>
            <h2 id="chapters-heading" className="display-lg mt-6 text-balance">
              {chapters.length > 0 ? (
                <>
                  <span className="text-gold">{chapters.length}</span> chapters.
                  One brotherhood.
                </>
              ) : (
                "Our chapters. One brotherhood."
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-[16px] leading-relaxed text-white/65 md:text-lg">
              Royal Ambassadors meet in local church chapters across the
              Pentecost Baptist Association. Find the chapter closest to you.
            </p>
            <ButtonLink href="/chapters" variant="gold" className="mt-7 hidden md:inline-flex">
              Find a chapter
            </ButtonLink>
            {/* Phones: search straight into the directory (works without JS). */}
            <form action="/chapters" method="get" role="search" className="mt-6 md:hidden">
              <label className="relative block">
                <span className="sr-only">Search chapters</span>
                <FiSearch className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden />
                <input
                  type="search"
                  name="q"
                  placeholder="Find a chapter"
                  className="h-[54px] w-full rounded-full border border-white/15 bg-white/[0.07] pl-12 pr-[7.5rem] text-[16px] text-white outline-none transition-colors placeholder:text-white/45 focus:border-gold focus:bg-white/10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 h-[42px] -translate-y-1/2 rounded-full bg-gold px-5 text-[14px] font-semibold text-ink active:scale-[0.98]"
                >
                  Search
                </button>
              </label>
            </form>
          </Reveal>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-px sm:grid-cols-2 md:mt-16 lg:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse border-t border-white/10 bg-white/[0.02]" />
            ))}
          </div>
        ) : (
          <Stagger as="ol" className="mt-10 grid sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-x-10">
            {preview.map((c, i) => (
              <StaggerItem as="li" key={c.id} className={i >= CHAPTER_PREVIEW_MOBILE ? "max-md:hidden" : undefined}>
                <Link
                  href={`/chapters?q=${encodeURIComponent(c.chapterName)}`}
                  className="group flex items-center gap-4 border-t border-white/10 py-4 transition-colors active:bg-white/[0.03] md:gap-5 md:py-6"
                >
                  <span className="font-mono text-[11px] tabular-nums text-white/35 transition-colors group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-[18px] font-bold tracking-[-0.02em] transition-transform duration-500 ease-brand group-hover:translate-x-1 md:text-[22px]">
                      {c.chapterName}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-white/45 md:mt-1 md:text-sm">
                      {c.churchName}
                    </span>
                  </span>
                  <FiArrowUpRight
                    className="h-5 w-5 shrink-0 text-white/25 transition-all duration-500 group-hover:rotate-45 group-hover:text-gold"
                    aria-hidden
                  />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {remainingMobile > 0 ? (
          <div className="border-t border-white/10 pt-6 md:hidden">
            <Link
              href="/chapters"
              className="flex min-h-[52px] items-center justify-between rounded-full bg-white/[0.07] px-6 text-[14px] font-semibold text-white active:bg-white/10"
            >
              Browse all {chapters.length} chapters
              <FiArrowRight className="h-4 w-4 text-gold" aria-hidden />
            </Link>
          </div>
        ) : null}

        {remaining > 0 ? (
          <div className="mt-2 hidden border-t border-white/10 pt-8 md:block">
            <Link
              href="/chapters"
              className="group inline-flex items-center gap-2 font-semibold text-white/80 transition-colors hover:text-gold"
            >
              + {remaining} more chapters in the directory
              <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ───────────────────────── Newsroom ───────────────────────── */

export function HomeNews({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;

  return (
    <section className="section-y bg-ivory" aria-labelledby="news-heading">
      <div className="container-site">
        <Reveal className="flex flex-col justify-between gap-6 border-b border-line pb-6 md:flex-row md:items-end md:pb-8">
          <div>
            <Eyebrow index="07">Newsroom</Eyebrow>
            <h2 id="news-heading" className="display-md mt-5 text-ink md:mt-6">
              Latest from the association
            </h2>
          </div>
          <ArrowLink href="/news" className="hidden md:inline-flex">All news &amp; announcements</ArrowLink>
        </Reveal>

        <div className="mt-8 grid gap-6 md:mt-12 md:gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Phones: cover story — full-bleed artwork over a dark caption panel. */}
          <Reveal className="md:hidden">
            <Link
              href={newsArticlePath(lead)}
              className="group -mx-5 block bg-ink text-white sm:-mx-8"
            >
              <div className="relative aspect-square max-h-[26rem] w-full overflow-hidden bg-primary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.image || NEWS_FALLBACK_IMAGE}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-brand group-active:scale-[1.02]"
                />
                <span className="eyebrow absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-ink shadow-sm sm:left-8">
                  {lead.category}
                </span>
              </div>
              <div className="relative px-5 pb-7 pt-6 sm:px-8">
                <span aria-hidden className="absolute -top-6 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink shadow-lg sm:right-8">
                  <FiArrowUpRight className="h-5 w-5" />
                </span>
                <p className="eyebrow text-gold">
                  Latest · {lead.date}
                  {lead.readTime ? ` · ${lead.readTime} min read` : ""}
                </p>
                <h3 className="mt-3 pr-6 font-heading text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
                  {lead.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-white/65">{lead.excerpt}</p>
              </div>
            </Link>
          </Reveal>

          <Reveal className="hidden md:block lg:col-span-7">
            <Link href={newsArticlePath(lead)} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.image || NEWS_FALLBACK_IMAGE}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-brand group-hover:scale-[1.04]"
                />
                <span className="eyebrow absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-ink">
                  {lead.category}
                </span>
              </div>
              <p className="eyebrow mt-6 text-text-muted">
                {lead.date}
                {lead.readTime ? ` · ${lead.readTime} min read` : ""}
              </p>
              <h3 className="mt-3 font-heading text-[28px] font-bold leading-[1.15] tracking-[-0.03em] text-ink transition-colors group-hover:text-primary md:text-[34px] text-balance">
                {lead.title}
              </h3>
              <p className="mt-4 line-clamp-3 max-w-2xl text-[17px] leading-relaxed text-text-muted">
                {lead.excerpt}
              </p>
            </Link>
          </Reveal>

          <Stagger as="ul" className="lg:col-span-5">
            {rest.slice(0, 3).map((item) => (
              <StaggerItem as="li" key={item.id} className="border-b border-line first:pt-0 last:border-0">
                <Link href={newsArticlePath(item)} className="group grid grid-cols-[5.5rem_1fr] items-center gap-4 py-4 active:bg-white/60 md:grid-cols-[1fr_9rem] md:items-start md:gap-5 md:py-6">
                  <div className="min-w-0 md:order-none max-md:order-2">
                    <p className="eyebrow text-[10px] text-gold md:text-[11px]">{item.category}</p>
                    <h3 className="mt-1.5 line-clamp-3 text-[16px] font-bold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-primary md:mt-2.5 md:text-lg">
                      {item.title}
                    </h3>
                    <p className="eyebrow mt-2 text-[10px] text-text-muted md:mt-3 md:text-[11px]">{item.date}</p>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-mist max-md:order-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || NEWS_FALLBACK_IMAGE}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-brand group-hover:scale-110"
                    />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Link
          href="/news"
          className="group mt-6 flex min-h-[52px] items-center justify-between rounded-full bg-ink px-6 text-[14px] font-semibold text-white md:hidden"
        >
          All news &amp; announcements
          <FiArrowRight className="h-4 w-4 text-gold" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── Closing invitation ───────────────────────── */

export function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-white" aria-labelledby="cta-heading">
      <Parallax strength={10}>
        <Image
          src="/images/colors-march-in.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
          style={{ objectPosition: "center 30%" }}
        />
      </Parallax>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,9,53,0.55)_0%,rgba(8,9,53,0.95)_75%)]" />

      <div className="container-site relative py-20 text-center sm:py-28 md:py-40">
        <Reveal>
          <p className="eyebrow text-gold">RA motto</p>
          <h2 id="cta-heading" className="display-xl mx-auto mt-6 max-w-5xl text-[clamp(2.2rem,10.5vw,3rem)] text-balance sm:mt-8 sm:text-[clamp(2.75rem,7.2vw,6.75rem)]">
            <span className="text-gold">“</span>It is easier to{" "}
            <em className="font-extrabold italic text-gold">mould</em> boys
            than to mend men.<span className="text-gold">”</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/70 sm:mt-8 sm:text-lg">
            Royal Ambassadors grow up in their local Baptist church. Find the
            chapter in your church — or talk to us about starting one.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:mt-12 sm:flex-row">
            <ButtonLink href="/chapters" variant="gold">
              Find your church&apos;s chapter
            </ButtonLink>
           
          </div>
        </Reveal>
      </div>
    </section>
  );
}
