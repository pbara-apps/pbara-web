"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ButtonLink, Eyebrow } from "@/components/site/primitives";

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

export function ProgramsShowcase() {
  return (
    <section className="section-y bg-ivory" aria-labelledby="programs-heading">
      <div className="container-site">
        <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
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
            <p className="text-lg leading-relaxed text-text-muted">
              Every activity is designed to grow boys spiritually, mentally,
              physically and socially — preparing them for a life of service.
            </p>
            <ButtonLink href="/events" variant="navy" className="mt-7">
              See events &amp; programs
            </ButtonLink>
          </Reveal>
        </div>

        <Stagger className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
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
