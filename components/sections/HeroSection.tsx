"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@heroui/react";

const HERO_IMAGES = [
  "/images/image2.jpg",
  "/images/image1.jpeg",
  "/images/image3.jpg",
  "/images/image4.jpg",
];

const FALLBACK_IMAGE = "/images/ra-logo.png";

const STATS = [
  { end: 120, label: "Active Chapters", suffix: "+" },
  { end: 5000, label: "Total Ambassadors", suffix: "+" },
  { end: 50, label: "Years of Impact", suffix: "+" },
  { end: 15, label: "Awards Won", suffix: "+" },
];

// The trick: we create a gradient that is 300% wide, then animate
// its X position from 0% to -66.66% — this makes it look like the
// smoke is drifting left-to-right infinitely and seamlessly.
const AURORA_STYLES = `
  @keyframes _smokeX {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-33.333%); }
  }

  @keyframes _smokeX2 {
    0%   { transform: translateX(-33.333%); }
    100% { transform: translateX(0%); }
  }

  @keyframes _pulseopacity {
    0%, 100% { opacity: 0.85; }
    50%       { opacity: 1; }
  }

  /* Subtle horizontal drift so the dark vignette "breathes" and more photo/smoke shows through in waves */
  @keyframes _vignetteDrift {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-4%); }
  }

  ._vignette-drift {
    animation: _vignetteDrift 22s ease-in-out infinite alternate;
    will-change: transform;
  }

  ._smoke-track {
    animation: _smokeX 18s linear infinite;
    will-change: transform;
  }

  ._smoke-track-reverse {
    animation: _smokeX2 24s linear infinite;
    will-change: transform;
  }

  ._smoke-pulse {
    animation: _pulseopacity 8s ease-in-out infinite;
  }
`;

function useCountUp(end: number, suffix: string, enabled: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, enabled]);
  return value + suffix;
}

function StatItem({
  end,
  label,
  suffix,
  isInView,
  index,
}: {
  end: number;
  label: string;
  suffix: string;
  isInView: boolean;
  index: number;
}) {
  const value = useCountUp(end, suffix, isInView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center"
    >
      <p className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white">
        {value}
      </p>
      <p className="text-xs md:text-sm uppercase tracking-wider text-white/70 mt-1">
        {label}
      </p>
    </motion.div>
  );
}

export function HeroSection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const setSlide = useCallback((index: number) => {
    setSlideIndex(index);
  }, []);

  return (
    <section
      className="-mt-16 pt-16 relative min-h-screen flex flex-col text-white overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <style dangerouslySetInnerHTML={{ __html: AURORA_STYLES }} />

      {/* ── Background layer stack ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 0 — solid dark base, always visible */}
        <div
          className="absolute inset-0"
          style={{ background: "#080f2a", zIndex: 0 }}
          aria-hidden
        />

        {/* Layer 1 — photo slideshow with slow 1.5s crossfade */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              transition: "opacity 1500ms ease-in-out",
              opacity: i === slideIndex ? 1 : 0,
              zIndex: 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        ))}

        {/*
          Layer 2 — base dark wash over photos (moderate opacity so
          the moving smoke layers above are visible).
        */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(8, 15, 42, 0.55)",
            zIndex: 2,
          }}
          aria-hidden
        />

        {/*
          Layer 3 — PRIMARY SMOKE TRACK (moves left → right)
          
          The element is 300% wide so it tiles seamlessly.
          It contains a repeating pattern of dark navy → lighter navy
          → semi-transparent gaps → dark again, creating the "clouds
          of smoke rolling across" look.
          
          translateX goes 0% → -33.33% over 18s, then loops.
          Because the pattern repeats every 33.33%, the loop is
          completely seamless — no jump.
        */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3, overflow: "hidden" }}
          aria-hidden
        >
          <div
            className="_smoke-track absolute top-0 bottom-0"
            style={{
              left: 0,
              width: "300%",
              background: `
                linear-gradient(
                  to right,
                  rgba(11,20,55,0.90)  0%,
                  rgba(14,26,65,0.78)  4%,
                  rgba(18,35,80,0.55)  8%,
                  rgba(22,42,95,0.30) 11%,
                  rgba(11,20,55,0.15) 14%,
                  rgba(8,15,40,0.08)  17%,
                  rgba(11,20,55,0.20) 19%,
                  rgba(16,30,72,0.50) 22%,
                  rgba(14,26,65,0.78) 25%,
                  rgba(11,20,55,0.90) 27%,
                  rgba(14,26,65,0.78) 30%,
                  rgba(18,35,80,0.55) 33.333%,

                  rgba(18,35,80,0.55)  33.333%,
                  rgba(22,42,95,0.30)  37.333%,
                  rgba(11,20,55,0.15)  40.333%,
                  rgba(8,15,40,0.08)   43.333%,
                  rgba(11,20,55,0.20)  46.333%,
                  rgba(16,30,72,0.50)  49.333%,
                  rgba(14,26,65,0.78)  52.333%,
                  rgba(11,20,55,0.90)  55.333%,
                  rgba(14,26,65,0.78)  58.333%,
                  rgba(18,35,80,0.55)  61.333%,
                  rgba(22,42,95,0.30)  64.333%,
                  rgba(11,20,55,0.15)  66.666%,

                  rgba(11,20,55,0.15)  66.666%,
                  rgba(8,15,40,0.08)   69.666%,
                  rgba(11,20,55,0.20)  72.666%,
                  rgba(16,30,72,0.50)  75.666%,
                  rgba(14,26,65,0.78)  78.666%,
                  rgba(11,20,55,0.90)  81.666%,
                  rgba(14,26,65,0.78)  84.666%,
                  rgba(18,35,80,0.55)  87.666%,
                  rgba(22,42,95,0.30)  90.666%,
                  rgba(11,20,55,0.15)  93.666%,
                  rgba(8,15,40,0.08)   96.666%,
                  rgba(11,20,55,0.90) 100%
                )
              `,
            }}
          />
        </div>

        {/*
          Layer 4 — SECONDARY SMOKE TRACK (moves right → left, slower)
          
          A second track running in the opposite direction at a different
          speed creates depth — like two layers of smoke at different
          distances. Uses gold tints to add warmth variation.
        */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 4, overflow: "hidden" }}
          aria-hidden
        >
          <div
            className="_smoke-track-reverse absolute top-0 bottom-0"
            style={{
              left: 0,
              width: "0%",
              background: `
                linear-gradient(
                  to right,
                  rgba(200,168,75,0.00)  0%,
                  rgba(16,30,72,0.40)    3%,
                  rgba(200,168,75,0.06)  7%,
                  rgba(11,20,55,0.35)   10%,
                  rgba(20,38,90,0.50)   13%,
                  rgba(200,168,75,0.04) 17%,
                  rgba(8,15,42,0.20)    20%,
                  rgba(16,30,72,0.40)   23%,
                  rgba(200,168,75,0.00) 26%,
                  rgba(11,20,55,0.35)   29%,
                  rgba(20,38,90,0.50)   32%,
                  rgba(200,168,75,0.06) 33.333%,

                  rgba(200,168,75,0.06) 33.333%,
                  rgba(11,20,55,0.35)   36.333%,
                  rgba(20,38,90,0.50)   39.333%,
                  rgba(200,168,75,0.04) 42.333%,
                  rgba(8,15,42,0.20)    45.333%,
                  rgba(16,30,72,0.40)   48.333%,
                  rgba(200,168,75,0.00) 51.333%,
                  rgba(11,20,55,0.35)   54.333%,
                  rgba(20,38,90,0.50)   57.333%,
                  rgba(200,168,75,0.06) 60.333%,
                  rgba(8,15,42,0.20)    63.333%,
                  rgba(16,30,72,0.40)   66.666%,

                  rgba(16,30,72,0.40)   66.666%,
                  rgba(200,168,75,0.00) 69.666%,
                  rgba(11,20,55,0.35)   72.666%,
                  rgba(20,38,90,0.50)   75.666%,
                  rgba(200,168,75,0.04) 78.666%,
                  rgba(8,15,42,0.20)    81.666%,
                  rgba(16,30,72,0.40)   84.666%,
                  rgba(200,168,75,0.00) 87.666%,
                  rgba(11,20,55,0.35)   90.666%,
                  rgba(20,38,90,0.50)   93.666%,
                  rgba(200,168,75,0.06) 96.666%,
                  rgba(16,30,72,0.40)  100%
                )
              `,
            }}
          />
        </div>

        {/* Layer 5 — left vignette (drifts slowly so smoke/photo can show through variably) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ zIndex: 5 }}
          aria-hidden
        >
          <div
            className="_vignette-drift absolute top-0 bottom-0 left-0"
            style={{
              width: "118%",
              background:
                "linear-gradient(to right, rgba(8,14,38,0.82) 0%, rgba(10,18,46,0.68) 18%, rgba(12,22,54,0.42) 40%, rgba(12,22,54,0.14) 58%, transparent 82%)",
            }}
          />
        </div>

        {/* Layer 6 — bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            zIndex: 5,
            background:
              "linear-gradient(to top, rgba(8,14,38,0.98) 0%, rgba(8,14,38,0.50) 45%, transparent 100%)",
          }}
          aria-hidden
        />
      </div>

      {/* ── Content panel ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto min-h-screen flex flex-col justify-center px-4 py-8 md:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto lg:mx-0 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gold text-gold text-xs font-semibold uppercase tracking-widest mb-6"
          >
            DISCIPLINE · SERVICE · FAITH
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
          >
            <span className="block text-white">
              Pentecost Baptist Association
            </span>
            <span className="block text-gold">Royal Ambassadors</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-white/70 italic text-base md:text-lg mb-8 max-w-lg"
          >
            Ambassadors for Christ: Raising godly boys into disciplined men of
            faith and integrity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row flex-wrap gap-4"
          >
            <Button
              as={Link}
              href="/about"
              className="bg-gold text-primary hover:opacity-90 font-semibold min-h-[44px]"
            >
              Learn Our Mission
            </Button>
            <Button
              as={Link}
              href="/events"
              variant="bordered"
              className="border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold min-h-[44px]"
            >
              View Calendar
            </Button>
          </motion.div>

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-gold/40 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:flex lg:justify-between"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`relative flex flex-col items-center min-h-[44px] justify-center ${
                  i > 0 ? "lg:border-l lg:border-gold/50 lg:pl-6" : ""
                }`}
              >
                <StatItem
                  end={stat.end}
                  label={stat.label}
                  suffix={stat.suffix}
                  isInView={statsInView}
                  index={i}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Desktop thumbnail strip ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 hidden lg:flex z-20 flex-col gap-3">
        {HERO_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setSlide(i)}
            className="relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#080f2a]"
            style={{
              borderColor:
                i === slideIndex ? "#C8A84B" : "rgba(255,255,255,0.15)",
              boxShadow:
                i === slideIndex ? "0 0 0 2px rgba(200,168,75,0.35)" : "none",
              opacity: i === slideIndex ? 1 : 0.6,
            }}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === slideIndex ? "true" : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE;
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Mobile dot indicators ── */}
      <div className="absolute bottom-5 left-0 right-0 flex lg:hidden z-20 justify-center gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSlide(i)}
            className="transition-all duration-300 rounded-full focus:outline-none"
            style={{
              width: i === slideIndex ? 24 : 8,
              height: 8,
              background:
                i === slideIndex ? "#C8A84B" : "rgba(255,255,255,0.35)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
