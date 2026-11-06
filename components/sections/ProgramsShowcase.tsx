"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ArrowLink, ButtonLink, Eyebrow } from "@/components/site/primitives";
import { SwipeRail } from "@/components/site/SwipeRail";

type Tile = {
  title: string;
  body: string;
  href: string;
  className: string;
  tone: "photo" | "gold" | "navy";
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  tag: string;
};

const TILES: Tile[] = [
  {
    title: "Parade & Drills",
    body: "Drill and parade build the discipline, bearing and teamwork that mark every Royal Ambassador.",
    href: "/events",
    tone: "photo",
    image: "/images/ra-march.jpg",
    imageAlt: "A Royal Ambassador marching in full uniform on the parade ground",
    imagePosition: "center 30%",
    className: "lg:col-span-7 lg:row-span-2 min-h-[26rem] lg:min-h-[38rem]",
    tag: "Discipline",
  },
  {
    title: "Annual Camping Exercise",
    body: "Our flagship gathering — days of worship, training, outdoor activity and fellowship for ambassadors across the association.",
    href: "/events",
    tone: "gold",
    className: "lg:col-span-5 min-h-[18rem]",
    tag: "Flagship",
  },
  {
    title: "Bible Study & Fellowship",
    body: "Studying Scripture together grounds each ambassador in personal faith and discipleship.",
    href: "/events",
    tone: "photo",
    image: "/images/event-cv.jpeg",
    imageAlt: "Ambassadors and leaders gathered in a church hall",
    className: "lg:col-span-5 min-h-[18rem]",
    tag: "Faith",
  },
  {
    title: "Sports & Competitions",
    body: "Inter-chapter competitions, like the JIF football tournament, build teamwork and healthy brotherhood.",
    href: "/events",
    tone: "navy",
    className: "lg:col-span-4 min-h-[18rem]",
    tag: "Brotherhood",
  },
  {
    title: "Community Outreach",
    body: "Mission action in our communities — serving others as an expression of Christ's love.",
    href: "/events",
    tone: "photo",
    image: "/images/ra-assembly.jpg",
    imageAlt: "Ambassadors, auxiliary members and leaders together outdoors",
    className: "lg:col-span-4 min-h-[22rem]",
    tag: "Service",
  },
  {
    title: "Leadership Development",
    body: "Officers and senior ambassadors are trained to lead with integrity and serve the association.",
    href: "/executives",
    tone: "photo",
    image: "/images/patrons.jpeg",
    imageAlt: "Association officers in uniform at an investiture ceremony",
    imagePosition: "center 30%",
    className: "lg:col-span-4 min-h-[22rem]",
    tag: "Leadership",
  },
];

function TileCard({ tile }: { tile: Tile }) {
  const isPhoto = tile.tone === "photo";
  return (
    <Link
      href={tile.href}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-7 transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 md:p-8",
        tile.tone === "gold" && "bg-gold text-ink",
        tile.tone === "navy" && "bg-primary text-white",
        isPhoto && "bg-ink text-white",
      )}
    >
      {isPhoto && tile.image ? (
        <>
          <Image
            src={tile.image}
            alt={tile.imageAlt ?? ""}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1.4s] ease-brand group-hover:scale-[1.06]"
            style={{ objectPosition: tile.imagePosition ?? "center" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-ink/5 transition-opacity duration-500"
          />
        </>
      ) : null}

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            "eyebrow rounded-full px-3 py-1.5",
            tile.tone === "gold"
              ? "bg-ink/10 text-ink"
              : "bg-white/10 text-white/85 backdrop-blur-md",
          )}
        >
          {tile.tag}
        </span>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-brand group-hover:rotate-45",
            tile.tone === "gold" ? "bg-ink text-gold" : "bg-white text-ink",
          )}
          aria-hidden
        >
          <FiArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      <div className="relative mt-16">
        <h3 className="font-heading text-[26px] font-bold leading-tight tracking-[-0.03em] md:text-[30px]">
          {tile.title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-md text-[15px] leading-relaxed",
            tile.tone === "gold" ? "text-ink/75" : "text-white/75",
          )}
        >
          {tile.body}
        </p>
      </div>
    </Link>
  );
}

/* ───────── Phones: one featured program, then a swipeable rail ───────── */

function FeaturedProgram({ tile }: { tile: Tile }) {
  return (
    <Link
      href={tile.href}
      className="group relative -mx-5 block aspect-[4/5] overflow-hidden bg-ink text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold sm:-mx-8"
    >
      {tile.image ? (
        <Image
          src={tile.image}
          alt={tile.imageAlt ?? ""}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[1.4s] ease-brand group-active:scale-[1.02]"
          style={{ objectPosition: tile.imagePosition ?? "center" }}
        />
      ) : null}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,31,0.35)_0%,rgba(5,6,31,0)_30%,rgba(5,6,31,0.2)_50%,rgba(5,6,31,0.92)_100%)]" />
      <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-8">
        <span className="eyebrow rounded-full bg-gold px-3 py-1.5 text-ink">Featured</span>
        <span className="eyebrow text-white/80">{tile.tag}</span>
      </div>
      <div className="absolute inset-x-5 bottom-6 sm:inset-x-8">
        <h3 className="font-heading text-[clamp(2rem,9.5vw,2.75rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
          {tile.title}
        </h3>
        <div className="mt-4 flex items-end justify-between gap-5">
          <p className="max-w-[17rem] text-[15px] leading-relaxed text-white/80">{tile.body}</p>
          <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
            <FiArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProgramSlide({ tile, index }: { tile: Tile; index: number }) {
  const isPhoto = tile.tone === "photo" && tile.image;
  return (
    <Link
      href={tile.href}
      className={cn(
        "group relative flex aspect-[3/4] flex-col overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        tile.tone === "gold" && "bg-gold text-ink",
        tile.tone === "navy" && "grain bg-primary text-white",
        isPhoto && "bg-ink text-white",
      )}
    >
      {isPhoto ? (
        <>
          {/* Photo cards: image fills the top, copy sits on a solid panel below. */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={tile.image!}
              alt={tile.imageAlt ?? ""}
              fill
              sizes="75vw"
              className="object-cover"
              style={{ objectPosition: tile.imagePosition ?? "center" }}
            />
            <span className="eyebrow absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1.5 text-white/90 backdrop-blur-md">
              {tile.tag}
            </span>
          </div>
          <div className="relative p-5">
            <span aria-hidden className="absolute -top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lg">
              <FiArrowUpRight className="h-4 w-4" />
            </span>
            <h3 className="pr-8 font-heading text-[21px] font-bold leading-tight tracking-[-0.025em]">{tile.title}</h3>
            <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-white/65">{tile.body}</p>
          </div>
        </>
      ) : (
        <>
          {/* Colour cards: an oversized index carries the composition. */}
          <div className="flex items-center justify-between p-5">
            <span className={cn("eyebrow", tile.tone === "gold" ? "text-ink/70" : "text-gold")}>{tile.tag}</span>
            <span
              aria-hidden
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                tile.tone === "gold" ? "bg-ink text-gold" : "bg-white text-ink",
              )}
            >
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 font-heading text-[9.5rem] font-extrabold leading-none tracking-[-0.08em]",
              tile.tone === "gold" ? "text-ink/[0.08]" : "text-white/[0.06]",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="relative mt-auto p-5">
            <h3 className="font-heading text-[26px] font-extrabold leading-[1.02] tracking-[-0.035em]">{tile.title}</h3>
            <p className={cn("mt-3 text-[14px] leading-relaxed", tile.tone === "gold" ? "text-ink/75" : "text-white/70")}>
              {tile.body}
            </p>
          </div>
        </>
      )}
    </Link>
  );
}

function MobilePrograms() {
  const [featured, ...rest] = TILES;
  return (
    <div className="md:hidden">
      <Reveal>
        <FeaturedProgram tile={featured} />
      </Reveal>
      <Reveal delay={0.05} className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="eyebrow text-ink">More activities</p>
          <p className="eyebrow text-text-muted">Swipe</p>
        </div>
        <SwipeRail label="Programs and activities" itemClassName="w-[74%] max-w-[19rem]">
          {rest.map((tile, i) => (
            <ProgramSlide key={tile.title} tile={tile} index={i + 1} />
          ))}
        </SwipeRail>
      </Reveal>
      <div className="mt-8">
        <ArrowLink href="/events">See events &amp; programs</ArrowLink>
      </div>
    </div>
  );
}

export function ProgramsShowcase() {
  return (
    <section className="section-y bg-ivory" aria-labelledby="programs-heading">
      <div className="container-site">
        <div className="mb-10 grid gap-5 md:mb-14 md:gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow index="03">Programs &amp; activities</Eyebrow>
            <h2
              id="programs-heading"
              className="display-lg mt-6 text-balance text-ink"
            >
              Formation through faith, drill and fellowship.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-[16px] leading-relaxed text-text-muted md:text-lg">
              Every activity is designed to grow boys spiritually, mentally,
              physically and socially — preparing them for a life of service.
            </p>
            <ButtonLink href="/events" variant="navy" className="mt-7 hidden md:inline-flex">
              See events &amp; programs
            </ButtonLink>
          </Reveal>
        </div>

        <MobilePrograms />

        <Stagger className="hidden auto-rows-auto grid-cols-1 gap-4 md:grid md:grid-cols-2 lg:grid-cols-12">
          {TILES.map((tile) => (
            <StaggerItem key={tile.title} className={tile.className}>
              <TileCard tile={tile} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
