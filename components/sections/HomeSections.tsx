"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { HomeExecutivesCarousel } from "@/components/sections/HomeExecutivesCarousel";
import type { Executive } from "@/types";
import type { NewsItem } from "@/types";
import {
  buttonHover,
  buttonTap,
  cardHover,
  cardTap,
  fadeInUp,
  inViewProps,
  motionSafe,
  scalePop,
  staggerContainer,
  staggerItem,
  zoomIn,
} from "@/lib/animations";

interface HomeSectionsProps {
  executives: Executive[];
  bulletins: NewsItem[];
}

function bulletinImage(item: NewsItem): string {
  if (item.image) return item.image;
  const byCategory: Record<string, string> = {
    Featured: "/images/image1.jpeg",
    Report: "/images/image4.jpg",
    Upcoming: "/images/image5.jpg",
  };
  return byCategory[item.category] ?? "/images/ra-logo.png";
}

function badgeClasses(category: string): string {
  if (category === "Upcoming") return "bg-gold text-primary";
  if (category === "Featured") return "bg-primary text-white";
  return "bg-primary text-white";
}

function metaIcon(category: string) {
  if (category === "Featured") return <FiCalendar size={16} aria-hidden />;
  if (category === "Report")
    return <HiOutlineMegaphone size={16} aria-hidden />;
  return <HiOutlineShieldCheck size={16} aria-hidden />;
}

export function HomeSections({ executives, bulletins }: HomeSectionsProps) {
  const reduced = useReducedMotion();
  const view = inViewProps(reduced);

  return (
    <>
      {/* ── Executive Council — horizontal carousel ── */}
      <section className="py-20 bg-surface" aria-labelledby="executive-heading">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16 space-y-4"
            {...view}
            variants={motionSafe(reduced, fadeInUp)}
          >
            <h2
              id="executive-heading"
              className="text-primary text-4xl font-black tracking-tight font-heading"
            >
              Executive Council
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" aria-hidden />
            <p className="text-text-muted font-medium">
              Leadership dedicated to the spiritual and social development of
              youth.
            </p>
          </motion.div>

          <motion.div {...view} variants={motionSafe(reduced, fadeInUp)}>
            <HomeExecutivesCarousel executives={executives} />
          </motion.div>
        </div>
      </section>

      {/* ── Latest Bulletins — staggered cards + image zoom ── */}
      <section
        className="py-20 bg-background"
        id="resources"
        aria-labelledby="bulletins-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
            {...view}
            variants={motionSafe(reduced, fadeInUp)}
          >
            <div className="space-y-2">
              <h2
                id="bulletins-heading"
                className="text-primary text-4xl font-black tracking-tight uppercase font-heading"
              >
                Latest Bulletins
              </h2>
              <p className="text-text-muted font-medium">
                Updates and announcements from across the association.
              </p>
            </div>
            <motion.div
              variants={motionSafe(reduced, scalePop)}
              whileHover={reduced ? undefined : buttonHover}
              whileTap={reduced ? undefined : buttonTap}
            >
              <Link
                href="/news"
                className="bg-white border border-slate-200 text-primary px-6 py-2 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-shadow uppercase tracking-wider min-h-[44px] inline-flex items-center justify-center touch-manipulation gap-1"
              >
                See All <FiArrowRight size={16} aria-hidden />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            {...view}
            variants={motionSafe(reduced, staggerContainer)}
          >
            {bulletins.slice(0, 3).map((item) => {
              const href = `/news/${item.slug ?? item.id}`;
              const imageSrc = bulletinImage(item);
              const badgeClass = badgeClasses(item.category);
              const ctaText =
                item.category === "Featured"
                  ? "DETAILS & REGISTRATION"
                  : item.category === "Upcoming"
                    ? "WORKSHOP DATES"
                    : "READ MORE";

              return (
                <motion.article
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group flex flex-col"
                  variants={motionSafe(reduced, staggerItem)}
                  whileHover={reduced ? undefined : cardHover}
                  whileTap={reduced ? undefined : cardTap}
                >
                  <motion.div
                    className="h-48 relative overflow-hidden bg-primary/10"
                    variants={motionSafe(reduced, zoomIn)}
                  >
                    <Image
                      alt={`${item.title} — bulletin`}
                      src={imageSrc}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div
                      className={`absolute top-4 left-4 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${badgeClass}`}
                    >
                      {item.category}
                    </div>
                  </motion.div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase mb-3">
                      {metaIcon(item.category)}
                      <span>
                        {item.category === "Featured"
                          ? item.date
                          : item.category}
                      </span>
                    </div>

                    <h3 className="text-primary text-xl font-black leading-tight mb-4 group-hover:text-gold transition-colors font-heading">
                      {item.title}
                    </h3>

                    <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {item.excerpt}
                    </p>

                    <Link
                      href={href}
                      className="text-primary font-bold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all min-h-[44px] touch-manipulation"
                    >
                      {ctaText}
                      <FiArrowRight size={16} aria-hidden />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
