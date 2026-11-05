"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { isVideoUrl } from "@/lib/media-utils";

export type MediaViewerItem = {
  type: "photo" | "video";
  url: string;
  title: string;
  alt?: string;
};

interface MediaViewerModalProps {
  /** All items in the current set, for previous / next navigation. */
  items?: MediaViewerItem[];
  /** Index of the open item, or null when closed. */
  index?: number | null;
  onIndexChange?: (index: number) => void;
  /** Single-item mode (kept for existing callers). */
  item?: MediaViewerItem | null;
  onClose: () => void;
}

/**
 * Full-screen lightbox for photos and videos. Arrow keys / buttons move
 * through the set, Escape closes, and page scroll is locked while open.
 */
export function MediaViewerModal({
  items,
  index = null,
  onIndexChange,
  item,
  onClose,
}: MediaViewerModalProps) {
  const list = items ?? (item ? [item] : []);
  const current = items ? (index != null ? items[index] : null) : (item ?? null);
  const i = items ? (index ?? 0) : 0;
  const canNavigate = list.length > 1 && !!onIndexChange;
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = (dir: 1 | -1) => {
    if (!canNavigate) return;
    onIndexChange!((i + dir + list.length) % list.length);
  };

  useEffect(() => {
    if (!current) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, i, list.length]);

  if (typeof document === "undefined") return null;

  const showVideo = current?.type === "video" && isVideoUrl(current.url);

  return createPortal(
    <AnimatePresence>
      {current ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[100] flex flex-col bg-ink/[0.97] text-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
            <p className="eyebrow text-white/55">
              {canNavigate ? (
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                </span>
              ) : (
                "Media"
              )}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close viewer"
            >
              <FiX className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.url}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-full w-full items-center justify-center"
              >
                {showVideo ? (
                  <video
                    src={current.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[78vh] w-full max-w-5xl rounded-lg bg-black object-contain"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.url}
                    alt={current.alt ?? current.title}
                    className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {canNavigate ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white hover:text-ink md:left-8"
                >
                  <FiChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white hover:text-ink md:right-8"
                >
                  <FiChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </>
            ) : null}
          </div>

          <p className="mx-auto max-w-3xl px-6 py-6 text-center text-[15px] font-medium text-white/80">
            {current.title}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
