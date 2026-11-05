"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Portrait for a person (officer, patron, Director). If there is no photo, or
 * the photo fails to load, the RA logo is shown instead.
 */
export function PersonPhoto({
  src,
  name,
  className,
  logoClassName,
}: {
  src?: string | null;
  name: string;
  /** Classes for the <img> (e.g. object position, hover effects). */
  className?: string;
  /** Size of the logo inside the fallback tile. */
  logoClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${name} (photo not available)`}
        className="absolute inset-0 flex items-center justify-center bg-primary"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 14px)" }}
        />
        <div className={cn("relative aspect-square w-[45%] max-w-[10rem]", logoClassName)}>
          <Image src="/images/ra-logo.png" alt="" fill sizes="160px" className="object-contain" />
        </div>
      </div>
    );
  }

  return (
    // Photos come from admin uploads on various hosts, so a plain img is used.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Portrait of ${name}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("absolute inset-0 h-full w-full object-cover object-top", className)}
    />
  );
}
