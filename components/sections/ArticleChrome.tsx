"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import { FiCheck, FiLink } from "react-icons/fi";
import { FaFacebookF, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

/** Thin gold bar under the navbar showing how far through the article you are. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gold"
    />
  );
}

export function ShareLinks({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://pbara.org.ng${path}`;
  const enc = encodeURIComponent;
  const links = [
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: FaWhatsapp },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: FaFacebookF },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, Icon: FaXTwitter },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  }

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";

  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={btn}>
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copy link" className={btn}>
        {copied ? <FiCheck className="h-4 w-4 text-emerald-600" aria-hidden /> : <FiLink className="h-4 w-4" aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
    </div>
  );
}
