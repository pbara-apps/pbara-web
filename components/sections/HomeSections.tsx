"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { HomeExecutivesCarousel } from "@/components/sections/HomeExecutivesCarousel";
import {
  ExecutivesSkeleton,
  useExecutives,
} from "@/components/sections/CurrentExecutivesGrid";
import { useChapters } from "@/components/sections/ChaptersDirectory";
import { Parallax, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ArrowLink, ButtonLink, Eyebrow } from "@/components/site/primitives";
import { newsArticlePath } from "@/lib/api/news";
import type { NewsItem } from "@/types";

const NEWS_FALLBACK_IMAGE = "/images/ra-parade.jpg";

/* ───────────────────────── Leadership ───────────────────────── */

export function HomeLeadership() {
  const { executives, isLoading } = useExecutives();

  return (
    <section className="section-y overflow-hidden bg-white" aria-labelledby="leadership-heading">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="05">Leadership</Eyebrow>
            <h2 id="leadership-heading" className="display-md mt-6 text-balance text-ink">
              The Executive Council
            </h2>
            <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-text-muted">
              Officers entrusted with the spiritual and social development of
              every ambassador in the association.
            </p>
            <ArrowLink href="/executives" className="mt-6">
              Meet the full council
            </ArrowLink>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-8">
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

export function HomeChapters() {
  const { chapters, isLoading } = useChapters();
  const preview = chapters.slice(0, CHAPTER_PREVIEW);
  const remaining = chapters.length - preview.length;

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
            <p className="text-lg leading-relaxed text-white/65">
              Royal Ambassadors meet in local church chapters across the
              Pentecost Baptist Association. Find the chapter closest to you.
            </p>
            <ButtonLink href="/chapters" variant="gold" className="mt-7">
              Find a chapter
            </ButtonLink>
          </Reveal>
        </div>

        {isLoading ? (
          <div className="mt-16 grid gap-px sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse border-t border-white/10 bg-white/[0.02]" />
            ))}
          </div>
        ) : (
          <Stagger as="ol" className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {preview.map((c, i) => (
              <StaggerItem as="li" key={c.id}>
                <Link
                  href={`/chapters?q=${encodeURIComponent(c.chapterName)}`}
                  className="group flex items-center gap-5 border-t border-white/10 py-6 transition-colors"
                >
                  <span className="font-mono text-[11px] tabular-nums text-white/35 transition-colors group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-xl font-bold tracking-[-0.02em] transition-transform duration-500 ease-brand group-hover:translate-x-1 md:text-[22px]">
                      {c.chapterName}
                    </span>
                    <span className="mt-1 block truncate text-sm text-white/45">
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

        {remaining > 0 ? (
          <div className="mt-2 border-t border-white/10 pt-8">
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
        <Reveal className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
          <div>
            <Eyebrow index="07">Newsroom</Eyebrow>
            <h2 id="news-heading" className="display-md mt-6 text-ink">
              Latest from the association
            </h2>
          </div>
          <ArrowLink href="/news">All news &amp; announcements</ArrowLink>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
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
                <Link href={newsArticlePath(item)} className="group grid grid-cols-[1fr_7.5rem] gap-5 py-6 sm:grid-cols-[1fr_9rem]">
                  <div className="min-w-0">
                    <p className="eyebrow text-gold">{item.category}</p>
                    <h3 className="mt-2.5 line-clamp-3 text-lg font-bold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="eyebrow mt-3 text-text-muted">{item.date}</p>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-mist">
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

      <div className="container-site relative py-28 text-center md:py-40">
        <Reveal>
          <p className="eyebrow text-gold">RA motto</p>
          <h2 id="cta-heading" className="display-xl mx-auto mt-8 max-w-5xl text-balance">
            <span className="text-gold">“</span>It is easier to{" "}
            <em className="font-extrabold italic text-gold">mould</em> boys
            than to mend men.<span className="text-gold">”</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            Royal Ambassadors grow up in their local Baptist church. Find the
            chapter in your church — or talk to us about starting one.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/chapters" variant="gold">
              Find your church&apos;s chapter
            </ButtonLink>
           
          </div>
        </Reveal>
      </div>
    </section>
  );
}
