"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { EASE, ImageReveal, Parallax } from "./motion";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: Crumb[];
  tone?: "light" | "dark";
}) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "eyebrow flex flex-wrap items-center gap-1.5",
          tone === "dark" ? "text-white/55" : "text-text-muted",
        )}
      >
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={cn(
                    "transition-colors",
                    tone === "dark" ? "hover:text-white" : "hover:text-ink",
                  )}
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-gold" : undefined}
                >
                  {c.label}
                </span>
              )}
              {!last ? <FiChevronRight className="h-3 w-3 opacity-60" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PageHeroProps {
  title: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  crumbs: Crumb[];
  /** dark = navy with photograph; light = ivory editorial header */
  tone?: "dark" | "light";
  image?: string;
  imageAlt?: string;
  /** CSS object-position for the photograph */
  imagePosition?: string;
  /** Rendered under the description (CTAs, meta). */
  children?: ReactNode;
  /** Right-hand column on large screens (dark tone) */
  aside?: ReactNode;
}

export function PageHero({
  title,
  eyebrow,
  description,
  crumbs,
  tone = "dark",
  image,
  imageAlt = "",
  imagePosition = "center 35%",
  children,
  aside,
}: PageHeroProps) {
  const enter = (delay: number) => ({
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        });

  if (tone === "light") {
    return (
      <header className="relative overflow-hidden bg-ivory pt-12 md:pt-16">
        <div className="container-site">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid gap-6 pb-10 md:mt-14 md:gap-8 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              {eyebrow ? (
                <motion.p {...enter(0)} className="eyebrow mb-5 text-gold">
                  {eyebrow}
                </motion.p>
              ) : null}
              <motion.h1
                {...enter(0.05)}
                className="display-lg text-[clamp(2.15rem,10.4vw,3rem)] text-balance text-ink md:text-[clamp(2.25rem,5vw,4.5rem)]"
              >
                {title}
              </motion.h1>
            </div>
            {(description || children) && (
              <motion.div {...enter(0.15)} className="lg:col-span-5 lg:pb-2">
                {description ? (
                  <p className="text-[16px] leading-relaxed text-text-muted text-pretty md:text-lg">
                    {description}
                  </p>
                ) : null}
                {children ? <div className="mt-7">{children}</div> : null}
              </motion.div>
            )}
          </div>
        </div>
        {image ? (
          <div className="container-site pb-4 max-sm:px-0 max-sm:pb-0">
            <ImageReveal className="aspect-[4/3] bg-mist sm:aspect-[16/9] sm:rounded-xl md:aspect-[21/8]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1320px) 100vw, 1320px"
                className="object-cover"
                style={{ objectPosition: imagePosition }}
              />
            </ImageReveal>
          </div>
        ) : (
          <div className="container-site">
            <div className="h-px bg-line" aria-hidden />
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="grain relative isolate flex flex-col overflow-hidden bg-ink text-white max-md:min-h-[min(78svh,42rem)] md:block">
      {image ? (
        <>
          <Parallax strength={6}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-80 md:opacity-60"
              style={{ objectPosition: imagePosition }}
            />
          </Parallax>
          <div
            aria-hidden
            className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(5,6,31,0.96)_0%,rgba(5,6,31,0.82)_45%,rgba(5,6,31,0.35)_100%)] md:block"
          />
          {/* Phones: photo shows at the top, copy sits on the darkened lower half. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,31,0.7)_0%,rgba(5,6,31,0.25)_20%,rgba(5,6,31,0.8)_45%,rgba(5,6,31,0.96)_68%,#05061f_100%)] md:hidden"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"
          />
        </>
      ) : null}

      <div className="container-site relative flex flex-1 flex-col pb-10 pt-8 md:block md:pb-24 md:pt-16">
        <Breadcrumbs items={crumbs} tone="dark" />
        <div className="mt-auto grid gap-8 pt-24 md:mt-24 md:gap-10 md:pt-0 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
            {eyebrow ? (
              <motion.p {...enter(0)} className="eyebrow mb-5 text-gold">
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h1 {...enter(0.05)} className="display-lg text-[clamp(2.15rem,10.4vw,3rem)] text-balance md:text-[clamp(2.25rem,5vw,4.5rem)]">
              {title}
            </motion.h1>
            {description ? (
              <motion.p
                {...enter(0.15)}
                className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/80 text-pretty md:mt-6 md:text-lg md:text-white/75"
              >
                {description}
              </motion.p>
            ) : null}
            {children ? (
              <motion.div {...enter(0.25)} className="mt-7 md:mt-9">
                {children}
              </motion.div>
            ) : null}
          </div>
          {aside ? (
            <motion.div {...enter(0.3)} className="lg:col-span-5">
              {aside}
            </motion.div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
