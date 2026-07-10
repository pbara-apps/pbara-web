import Image from "next/image";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import type { Executive } from "@/types";
import { cn } from "@heroui/react";

interface ExecutiveCardProps {
  executive: Executive;
  /** "officer" = executives page (aspect-[3/4], gold border, hover scale). Omit = default card. */
  variant?: "default" | "officer";
}

export function ExecutiveCard({
  executive,
  variant = "default",
}: ExecutiveCardProps) {
  const hasImage = Boolean(executive.image);

  if (variant === "officer") {
    return (
      <article className="group h-full flex flex-col bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all overflow-hidden">
        <div className="relative aspect-[1.2] shrink-0 overflow-hidden rounded-lg mb-2 border-4 border-[#D4AF37]/30">
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500",
              !executive.image && "grayscale hover:grayscale-0",
            )}
            style={{
              backgroundImage: `url(${executive.image ?? "/images/ra-logo.png"})`,
            }}
            role="img"
            aria-label={`Portrait of ${executive.name}`}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center px-4 py-3 bg-primary rounded-bl-2xl rounded-tr-2xl min-h-[7.5rem]">
          <h3 className="text-white text-lg font-bold leading-tight line-clamp-2">
            {executive.name}
          </h3>
          <p className="text-white/90 font-semibold text-sm mt-1 uppercase tracking-wider line-clamp-1">
            {executive.position}
          </p>
          <p className="text-slate-100 dark:text-slate-400 text-xs mt-1 line-clamp-1">
            {executive.church}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-surface rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden text-center hover:border-t-2 hover:border-t-gold">
      <div className="relative h-[60%] min-h-[200px] bg-background flex items-center justify-center p-6">
        {hasImage ? (
          <Image
            src={executive.image!}
            alt={executive.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
        ) : (
          <AvatarPlaceholder name={executive.name} size="lg" />
        )}
      </div>
      <div className="p-4 bg-surface">
        <h3 className="font-heading font-bold text-text-dark">
          {executive.name}
        </h3>
        <p className="text-gold text-sm uppercase tracking-wider mt-1 small-caps">
          {executive.position}
        </p>
        <p className="text-text-muted text-sm mt-1 flex items-center justify-center gap-1">
          <HiOutlineBuildingOffice2
            size={14}
            className="shrink-0"
            aria-hidden
          />
          {executive.church}
        </p>
      </div>
    </article>
  );
}
