"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { MdFormatQuote } from "react-icons/md";
import {
  buttonHover,
  buttonTap,
  fadeInUp,
  inViewProps,
  motionSafe,
  scalePop,
  slideInLeft,
  slideInRight,
  zoomIn,
} from "@/lib/animations";

type DirectorDeskData = {
  name: string;
  title: string;
  description: string;
  image?: string | null;
};

/**
 * Full-width card: left — director photo placeholder + name overlay; right — quote marks, heading, message, read more link
 */
export function DirectorDesk({ data }: { data: DirectorDeskData }) {
  const directorPortraitSrc = data.image || "/images/ik.png";
  const reduced = useReducedMotion();
  const view = inViewProps(reduced);

  return (
    <section className="py-20 bg-background" aria-labelledby="director-heading">
      <div className="max-w-7xl mx-auto px-6">
        <motion.article
          className="bg-surface rounded-xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row"
          {...view}
          variants={motionSafe(reduced, fadeInUp)}
        >
          {/* Left: portrait block — slides in from left */}
          <motion.div
            className="md:w-1/3 relative min-h-[400px]"
            {...view}
            variants={motionSafe(reduced, slideInLeft)}
          >
            <div className="absolute inset-0 bg-primary/20 z-10" aria-hidden />
            <motion.div
              className="absolute inset-0"
              {...view}
              variants={motionSafe(reduced, zoomIn)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Portrait of the Association Director"
                src={directorPortraitSrc}
                className="absolute inset-0 w-full h-full object-cover bg-[#9bbec4]"
              />
            </motion.div>

            <div className="absolute bottom-6 left-6 z-20">
              <h4 className="text-white text-xl font-bold">{data.name}</h4>
              <p className="text-gold text-sm font-semibold">{data.title}</p>
            </div>
          </motion.div>

          {/* Right: content — slides in from right */}
          <motion.div
            className="md:w-2/3 p-10 md:p-16 flex flex-col justify-center gap-6"
            {...view}
            variants={motionSafe(reduced, slideInRight)}
          >
            <div className="space-y-4">
              <MdFormatQuote size={48} className="text-gold" aria-hidden />
              <h3
                id="director-heading"
                className="font-heading text-3xl font-black text-primary tracking-tight"
              >
                From the Director&apos;s Desk
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {data.description}
              </p>
            </div>

            <div className="pt-4">
              <motion.div
                className="inline-block"
                {...view}
                variants={motionSafe(reduced, scalePop)}
                whileHover={reduced ? undefined : buttonHover}
                whileTap={reduced ? undefined : buttonTap}
              >
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm hover:text-gold transition-colors min-h-[44px] touch-manipulation"
                >
                  Read Full Vision Statement
                  <FiArrowRight size={18} aria-hidden />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
