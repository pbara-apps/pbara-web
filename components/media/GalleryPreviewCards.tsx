"use client";

import { getCloudinaryVideoPoster, isVideoUrl } from "@/lib/media-utils";
import { FiPlay } from "react-icons/fi";

interface VideoPreviewCardProps {
  url: string;
  title: string;
  alt: string;
  category?: string;
  onOpen: () => void;
}

export function VideoPreviewCard({
  url,
  title,
  alt,
  category,
  onOpen,
}: VideoPreviewCardProps) {
  const poster = getCloudinaryVideoPoster(url);
  const playable = isVideoUrl(url);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full cursor-pointer text-left"
      aria-label={`Watch ${title}`}
    >
      <div className="relative mb-3 aspect-video overflow-hidden rounded-xl border border-slate-200 shadow-md dark:border-slate-800">
        {playable ? (
          poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <video
              src={url}
              preload="metadata"
              muted
              playsInline
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        <div
          className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/95 text-primary shadow-lg transition-transform group-hover:scale-110">
            <FiPlay size={28} className="ml-1" aria-hidden />
          </span>
        </div>
      </div>

      <h4 className="text-sm font-bold leading-snug text-primary transition-colors group-hover:text-accent-gold dark:text-slate-200">
        {title}
      </h4>
      {category ? (
        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {category}
        </p>
      ) : null}
    </button>
  );
}

interface PhotoPreviewCardProps {
  src: string;
  alt: string;
  title?: string;
  onOpen: () => void;
}

export function PhotoPreviewCard({
  src,
  alt,
  title,
  onOpen,
}: PhotoPreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full break-inside-avoid overflow-hidden rounded-lg border border-primary/10 text-left"
      aria-label={title ? `View ${title}` : `View ${alt}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block h-auto w-full" />
      <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
          View
        </span>
      </div>
    </button>
  );
}
