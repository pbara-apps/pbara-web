import { AvatarPlaceholder } from "./AvatarPlaceholder";
import type { Patron } from "@/types";

interface PatronCardProps {
  patron: Patron;
  /** If true, layout is square photo left, name + role + quote right (executives page). Else centered (about page). */
  horizontal?: boolean;
}

function PatronPhoto({
  patron,
  className,
}: {
  patron: Patron;
  className?: string;
}) {
  if (patron.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={patron.image}
        alt={patron.name}
        className={className ?? "h-full w-full rounded-full object-cover"}
      />
    );
  }
  return <AvatarPlaceholder name={patron.name} size="lg" />;
}

/**
 * Photo, name, role in gold, quote/description
 */
export function PatronCard({ patron, horizontal = false }: PatronCardProps) {
  if (horizontal) {
    return (
      <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 border-l-4 border-l-gold bg-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:flex-row">
        <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-l-xl bg-background p-6 sm:w-32">
          <div className="h-20 w-20 overflow-hidden rounded-full">
            <PatronPhoto patron={patron} />
          </div>
        </div>
        <div className="flex-1 p-6">
          <span
            className="font-heading text-4xl leading-none text-gold/60"
            aria-hidden
          >
            &ldquo;
          </span>
          <h3 className="mt-1 font-heading font-bold text-text-dark">
            {patron.name}
          </h3>
          <p className="small-caps mt-1 text-sm font-semibold uppercase tracking-wider text-gold">
            {patron.role}
          </p>
          <p className="mt-3 text-sm italic text-text-muted">
            &ldquo;{patron.quote}&rdquo;
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-surface text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-center p-6">
        <div className="h-24 w-24 overflow-hidden rounded-full">
          <PatronPhoto patron={patron} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-text-dark">{patron.name}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gold">
          {patron.role}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          {patron.description ?? patron.quote}
        </p>
      </div>
    </article>
  );
}
