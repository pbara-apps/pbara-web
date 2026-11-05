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
      <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-primary">
        {playable ? (
          poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <video
              src={url}
              preload="metadata"
              muted
              playsInline
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        <div
          className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/45"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/95 text-primary shadow-lg transition-transform group-hover:scale-[1.04]">
            <FiPlay size={28} className="ml-1" aria-hidden />
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
        {title}
      </h3>
      {category ? (
        <p className="eyebrow mt-1.5 text-gold">
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
      className="group relative block w-full overflow-hidden rounded-xl bg-mist text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      aria-label={title ? `View ${title}` : `View ${alt}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block h-auto w-full transition-transform duration-[1.2s] ease-brand group-hover:scale-[1.04]"
      />
      <span
        aria-hidden
        className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="text-[15px] font-semibold leading-snug text-white">{title ?? alt}</span>
      </span>
    </button>
  );
}
