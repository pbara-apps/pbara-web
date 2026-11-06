"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { ButtonLink } from "@/components/site/primitives";
import { EASE, usePrefersReducedMotion } from "@/components/site/motion";


const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: "Raising a" },
  { text: "Generation of" },
  { text: "Ambassadors", accent: true },
  { text: "for Christ." },
];

/**
 * Homepage hero: editorial headline on the left, edge-bleeding photograph on
 * the right with a smaller overlapping parade image.
 */
export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const line = (i: number) => ({
          initial: { y: "110%" },
          animate: { y: "0%" },
          transition: { duration: 1.05, ease: EASE, delay: 0.15 + i * 0.09 },
        });
  const fade = (delay: number) => ({
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        });

  return (
    <section
      ref={ref}
      className="grain relative isolate -mt-[73px] overflow-hidden bg-ink pt-[73px] text-white"
      aria-labelledby="hero-heading"
    >
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-1/3 h-[38rem] w-[38rem] rounded-full bg-primary blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:calc(100%/6)_100%]" />
      </div>

      <div className="container-site relative grid min-h-[calc(100svh-112px)] items-end gap-12 pb-10 pt-10 sm:pb-14 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-24 lg:pt-6">
        {/* Copy */}
        <div className="relative z-10 lg:col-span-7">
          <motion.p {...fade(0)} className="eyebrow mb-6 flex items-center gap-3 text-white/70 lg:mb-8 lg:text-white/60">
            <span aria-hidden className="h-px w-10 bg-gold lg:w-28" />
            <span className="text-gold lg:hidden">2 Cor 5:20</span>
          </motion.p>

          <h1
            id="hero-heading"
            className="font-heading text-[clamp(2.45rem,12.4vw,4.25rem)] font-extrabold leading-[0.92] tracking-[-0.045em] [text-shadow:0_2px_30px_rgba(5,6,31,0.35)] lg:text-[clamp(3.5rem,5.6vw,5.6rem)] lg:leading-[0.95] lg:tracking-[-0.04em] lg:[text-shadow:none]"
          >
            {HEADLINE.map((l, i) => (
              <span key={l.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  {...line(i)}
                  className={
                    l.accent
                      ? "block font-extrabold italic text-gold"
                      : "block"
                  }
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...fade(0.6)}
            className="mt-5 max-w-[34rem] text-[16px] leading-relaxed text-white/80 text-pretty sm:hidden"
          >
            Training boys and young men in faith, discipline and Christlike
            character.
          </motion.p>
          <motion.p
            {...fade(0.6)}
            className="mt-6 hidden max-w-[34rem] text-lg leading-relaxed text-white/80 text-pretty sm:block lg:mt-8 lg:text-white/70 md:text-xl"
          >
            The Royal Ambassadors of the Pentecost Baptist Association train
            boys and young men in faith, discipline and Christlike character —
            through discipleship, drill, camping, missions and service.
          </motion.p>

          <motion.div {...fade(0.72)} className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-3 lg:mt-10">
            <ButtonLink href="/about" variant="gold" className="min-h-[54px] text-[15px] sm:min-h-[48px] sm:text-[14px]">
              Discover our mission
            </ButtonLink>
            <ButtonLink href="/events" variant="outline-light" className="hidden sm:inline-flex">
              Explore our programs
            </ButtonLink>
            <Link
              href="/events"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 text-[14px] font-semibold text-white/85 sm:hidden"
            >
              <span className="border-b border-white/30 pb-0.5">Explore our programs</span>
              <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
            </Link>
          </motion.div>

          
        </div>

        {/* Photographic composition */}
        <div className="absolute inset-0 -z-[1] lg:relative lg:inset-auto lg:z-auto lg:col-span-5 lg:mr-[calc(-1*max(3rem,(100vw_-_82rem)/2_+_3rem))]">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            className="relative h-full overflow-hidden bg-primary lg:aspect-auto lg:h-[min(76vh,46rem)] lg:rounded-xl lg:rounded-r-none"
          >
            <motion.div
              className="absolute -inset-y-[8%] inset-x-0"
              style={reduced ? undefined : { y: imageY }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: EASE, delay: 0.2 }}
              >
                <Image
                  src="/images/ra-ambassadors.jpg"
                  alt="Four smiling Royal Ambassadors in full navy uniform"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-[60%_8%] lg:object-[55%_30%]"
                />
              </motion.div>
            </motion.div>
            <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-ink/50 via-transparent to-transparent lg:block" />
            {/* Phones/tablets: photo sits behind the copy, so darken where text lands. */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,31,0.6)_0%,rgba(5,6,31,0)_18%,rgba(5,6,31,0.1)_34%,rgba(5,6,31,0.78)_56%,rgba(5,6,31,0.96)_74%,#05061f_100%)] lg:hidden" />

            <motion.p
              {...fade(1.1)}
              className="absolute right-5 top-5 hidden rounded-full lg:block bg-ink/70 px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/85 backdrop-blur-md md:right-8 md:top-8"
            >
              <span className="text-gold">2 Cor 5:20</span> — We are Ambassadors for Christ
            </motion.p>
          </motion.div>

          {/* Overlapping parade card */}
          <motion.figure
            style={reduced ? undefined : { y: cardY }}
            className="absolute -bottom-10 left-4 hidden w-[34%] max-w-[13rem] lg:-left-16 lg:bottom-10 lg:block"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.9 }}
              className="overflow-hidden rounded-lg bg-white p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-md">
                <Image
                  src="/images/ra-salute.jpg"
                  alt="A young Royal Ambassador saluting during drill"
                  fill
                  sizes="240px"
                  className="object-cover"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              <figcaption className="flex items-center justify-between px-2 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70">
                <span>On parade</span>
                <span className="text-gold">PBA</span>
              </figcaption>
            </motion.div>
          </motion.figure>
        </div>
      </div>

    </section>
  );
}
