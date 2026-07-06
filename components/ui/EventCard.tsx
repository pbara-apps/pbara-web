import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiShare2 } from "react-icons/fi";
import { Button } from "@heroui/react";
import { Chip } from "@heroui/react";
import type { EventItem } from "@/types";
import { formatEventDateLabel, parseEventDateParts } from "@/lib/event-date";

interface EventCardProps {
  event: EventItem;
  horizontal?: boolean;
  past?: boolean;
}

function formatDate(dateStr: string, endDate?: string | null) {
  return parseEventDateParts(dateStr, endDate);
}

/**
 * Horizontal layout: date block, details (category, location, title, description, Register Now + share), image
 * Or vertical for past events: image, date overlay, title, description, View link
 */
export function EventCard({ event, horizontal = true, past = false }: EventCardProps) {
  const imageSrc = event.image ?? "/images/ra-logo.png";
  const imageAlt = event.image ? `${event.title} — Royal Ambassadors` : "Royal Ambassadors logo as event placeholder";

  if (past) {
    const dateLabel = formatEventDateLabel(event.date, event.endDate);
    return (
      <article className="bg-surface rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden flex flex-col">
        <div className="relative aspect-video w-full bg-primary/10">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="360px" />
          <div className="absolute top-2 right-2">
            <Chip size="sm" className="bg-white/90 text-text-dark text-xs">{dateLabel}</Chip>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-text-dark line-clamp-2">{event.title}</h3>
          <p className="text-text-muted text-sm line-clamp-2 mt-1 flex-1">{event.description}</p>
          <Link href={`/events#${event.id}`} className="text-primary font-semibold text-sm hover:text-gold mt-3 inline-flex items-center gap-1">
            View Gallery
            <span aria-hidden>→</span>
          </Link>
        </div>
      </article>
    );
  }

  if (!horizontal) {
    return (
      <article className="bg-surface rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden flex flex-col">
        <div className="relative aspect-video w-full bg-primary/10">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="360px" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-text-dark line-clamp-2">{event.title}</h3>
          <p className="text-text-muted text-sm line-clamp-2 mt-1">{event.description}</p>
          <Button as={Link} href={`/events#${event.id}`} className="mt-4 bg-gold text-primary font-semibold w-fit">
            Register Now →
          </Button>
        </div>
      </article>
    );
  }

  const { day, month, year } = formatDate(event.date, event.endDate);

  return (
    <article className="bg-surface rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden flex flex-col md:flex-row">
      <div className="order-2 md:order-1 md:w-24 shrink-0 bg-background flex flex-col items-center justify-center py-4 px-3 border-b md:border-b-0 md:border-r border-gray-200">
        <span className="text-[48px] font-heading font-bold text-primary leading-none">{day}</span>
        <span className="text-xs uppercase text-gold mt-1">{month}</span>
        <span className="text-xs text-text-muted">{year}</span>
      </div>
      <div className="order-3 md:order-2 flex-1 p-6 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Chip size="sm" className="bg-primary/10 text-primary uppercase text-xs">{event.category}</Chip>
          <span className="text-sm text-text-muted flex items-center gap-1">
            <FiMapPin size={18} className="shrink-0" aria-hidden />
            {event.venue}
          </span>
        </div>
        <h3 className="font-heading font-bold text-text-dark text-lg">{event.title}</h3>
        <p className="text-text-muted text-sm mt-1 line-clamp-2 flex-1">{event.description}</p>
        <div className="flex items-center gap-3 mt-4">
          <Button as={Link} href={`/events#${event.id}`} className="bg-gold text-primary font-semibold">
            Register Now →
          </Button>
          <button type="button" className="p-2 text-text-muted hover:text-gold rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Share event">
            <FiShare2 size={22} />
          </button>
        </div>
      </div>
      <div className="order-1 md:order-3 relative aspect-video md:aspect-auto md:w-56 md:min-h-[160px] md:h-full shrink-0 bg-primary/10 rounded-xl overflow-hidden">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 224px" />
      </div>
    </article>
  );
}
