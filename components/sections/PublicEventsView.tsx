"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiMapPin, FiShare2 } from "react-icons/fi";
import type { EventItem } from "@/types";
import { parseEventDateParts, formatEventDateLabel, isIsoDate } from "@/lib/event-date";
import { registrationPath } from "@/lib/api/program";
import { EventInterestModal } from "./EventInterestModal";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useSubscribeNewsletter } from "@/service/apis/subscriber";
import { PageHero } from "@/components/site/PageHero";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import { ArrowLink, Eyebrow } from "@/components/site/primitives";
import { cn } from "@/lib/cn";
import { previewText } from "@/lib/format";

const ARCHIVE_PAGE = 6;

function eventAnchor(e: EventItem) {
  return `event-${e.id}`;
}

function sortByDate(list: EventItem[], dir: 1 | -1) {
  return [...list].sort((a, b) => {
    const da = isIsoDate(a.date) ? Date.parse(a.date) : NaN;
    const db = isIsoDate(b.date) ? Date.parse(b.date) : NaN;
    if (Number.isNaN(da) || Number.isNaN(db)) return 0;
    return (da - db) * dir;
  });
}

/* ── Countdown ── */
function useCountdown(target: string | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!target) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target || now == null) return null;
  const total = Math.max(0, Date.parse(target) - now);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
  };
}

function NextEventCard({ event }: { event: EventItem }) {
  const left = useCountdown(isIsoDate(event.date) ? `${event.date}T08:00:00` : null);
  return (
    <a
      href={`#${eventAnchor(event)}`}
      className="group block rounded-xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md transition-colors hover:border-white/30 md:p-7"
    >
      <p className="eyebrow flex items-center gap-2 text-gold">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
        Next up
      </p>
      <p className="mt-4 text-xl font-bold leading-snug text-white">{event.title}</p>
      <p className="mt-2 text-sm text-white/60">
        {formatEventDateLabel(event.date, event.endDate)}
      </p>
      {left ? (
        <dl className="mt-6 grid grid-cols-4 gap-2 border-t border-white/10 pt-5" aria-label="Time until the event">
          {(
            [
              ["Days", left.days],
              ["Hrs", left.hours],
              ["Min", left.minutes],
              ["Sec", left.seconds],
            ] as const
          ).map(([label, v]) => (
            <div key={label}>
              <dd className="font-heading text-3xl font-extrabold tabular-nums tracking-[-0.04em] text-white">
                {String(v).padStart(2, "0")}
              </dd>
              <dt className="eyebrow mt-1 text-white/45">{label}</dt>
            </div>
          ))}
        </dl>
      ) : null}
    </a>
  );
}

/* ── Actions ── */
function RegisterAction({
  event,
  onInterest,
  className,
}: {
  event: EventItem;
  onInterest: (e: EventItem) => void;
  className?: string;
}) {
  const classes = cn("btn btn-gold group", className);
  if (event.registrationProgramSlug) {
    return (
      <Link href={registrationPath(event.registrationProgramSlug)} className={classes}>
        Register now
        <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => onInterest(event)} className={classes}>
      Register interest
      <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
    </button>
  );
}

function ShareButton({ event }: { event: EventItem }) {
  async function share() {
    const url = `${window.location.origin}/events#${eventAnchor(event)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      successToast("Event link copied to your clipboard.", "Link copied");
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        errorToast("Could not share this event. Please copy the page link instead.");
      }
    }
  }
  return (
    <button
      type="button"
      onClick={share}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
      aria-label={`Share ${event.title}`}
    >
      <FiShare2 className="h-4 w-4" aria-hidden />
    </button>
  );
}

function EventImage({ event }: { event: EventItem }) {
  if (event.image) {
    return (
      // Event images come from admin uploads on different hosts.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={event.image}
        alt={`${event.title} — event image`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-brand group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-primary">
      <Image src="/images/ra-logo.png" alt="" width={88} height={88} className="rounded-full opacity-80" />
    </div>
  );
}

/** Phones: date block that overlaps the bottom edge of the spotlight image. */
function SpotlightDate({ event }: { event: EventItem }) {
  const { day, month, year } = parseEventDateParts(event.date, event.endDate);
  return (
    <div className="absolute -bottom-6 left-5 flex items-stretch overflow-hidden rounded-xl shadow-[0_20px_40px_-20px_rgba(5,6,31,0.6)] sm:left-8 md:hidden">
      <div className="flex flex-col items-center justify-center bg-gold px-4 py-2.5 text-ink">
        <span className="font-heading text-[30px] font-extrabold leading-none tracking-[-0.05em]">{day}</span>
        <span className="eyebrow mt-1 text-[9px] tracking-[0.14em]">{month}</span>
      </div>
      <div className="flex flex-col justify-center bg-ink px-4 text-white">
        <span className="eyebrow text-[9px] text-white/55">Next up</span>
        <span className="mt-1 text-[13px] font-semibold">
          {formatEventDateLabel(event.date, event.endDate) || year}
        </span>
      </div>
    </div>
  );
}

/* ── Page ── */
export function PublicEventsView({
  upcomingEvents,
  pastEvents,
}: {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
}) {
  const [interestEvent, setInterestEvent] = useState<EventItem | null>(null);
  const [archiveCount, setArchiveCount] = useState(ARCHIVE_PAGE);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const subscribe = useSubscribeNewsletter();

  const upcoming = sortByDate(upcomingEvents, 1);
  const past = sortByDate(pastEvents, -1);
  const [lead, ...moreUpcoming] = upcoming;

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    try {
      const res = await subscribe.mutateAsync({ email, source: "events-page" });
      successToast(
        res?.message ?? "You're subscribed! We'll keep you posted.",
        "Subscribed",
      );
      setNewsletterEmail("");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ??
          "Unable to subscribe right now. Please try again.",
        "Subscription failed",
      );
    }
  }

  return (
    <>
      <PageHero
        crumbs={[{ label: "Events & programs" }]}
        eyebrow="Calendar"
        title="Events and programs"
        description="Strengthening the faith and discipline of young men through dedicated fellowship and service."
        image="/images/ra-colour-party.jpg"
        imagePosition="center 45%"
        aside={lead ? <NextEventCard event={lead} /> : undefined}
      />

      {/* Upcoming */}
      <section className="section-y bg-ivory" aria-labelledby="upcoming-heading">
        <div className="container-site">
          <Reveal className="mb-8 flex flex-col justify-between gap-3 border-b border-line pb-6 md:mb-12 md:flex-row md:items-end md:gap-4 md:pb-8">
            <div>
              <Eyebrow index="01">Upcoming</Eyebrow>
              <h2 id="upcoming-heading" className="display-md mt-5 text-ink">
                Upcoming programs
              </h2>
            </div>
            <p className="max-w-md text-[15px] text-text-muted md:text-[16px]">
              Join our scheduled activities and developmental sessions.
            </p>
          </Reveal>

          {!lead ? (
            <p className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-text-muted">
              No upcoming events are scheduled right now. Check back soon, or
              follow the <Link href="/news" className="font-semibold text-primary underline">newsroom</Link> for announcements.
            </p>
          ) : (
            <>
              {/* Lead event */}
              <article
                id={eventAnchor(lead)}
                className="group -mx-5 grid scroll-mt-28 overflow-hidden bg-white sm:-mx-8 md:mx-0 md:rounded-2xl md:ring-1 md:ring-line lg:grid-cols-12"
              >
                <div className="relative lg:col-span-6">
                  <ImageReveal className="aspect-[4/3] bg-primary max-md:aspect-square max-md:max-h-[28rem] max-md:w-full lg:aspect-auto lg:h-full lg:min-h-[32rem]">
                    <EventImage event={lead} />
                  </ImageReveal>
                  {/* Phones: spotlight badge with the date, overlapping the image. */}
                  <SpotlightDate event={lead} />
                </div>
                <div className="flex flex-col p-5 pt-10 sm:p-8 sm:pt-12 md:p-12 lg:col-span-6">
                  <div className="hidden md:block">
                    <EventMeta event={lead} />
                  </div>
                  <p className="eyebrow text-gold md:hidden">Spotlight · {lead.category}</p>
                  <h3 className="display-md mt-3 text-[clamp(1.75rem,8vw,2.25rem)] text-balance text-ink md:mt-6 md:text-[clamp(1.875rem,3.4vw,3rem)]">{lead.title}</h3>
                  {lead.venue ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[14px] text-text-muted md:hidden">
                      <FiMapPin className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                      {lead.venue}
                    </p>
                  ) : null}
                  <p className="mt-4 line-clamp-4 whitespace-pre-line text-[15px] leading-relaxed text-text-muted md:mt-5 md:line-clamp-[8] md:text-[16px]">
                    {lead.description}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-7 md:pt-10">
                    <RegisterAction event={lead} onInterest={setInterestEvent} className="max-md:flex-1" />
                    <ShareButton event={lead} />
                  </div>
                </div>
              </article>

              {/* Remaining upcoming */}
              {moreUpcoming.length > 0 ? (
                <>
                <p className="eyebrow mb-2 mt-12 text-ink md:hidden">Coming up next</p>
                <Stagger as="ol" className="relative mt-0 overflow-hidden md:mt-6 md:divide-y md:divide-line md:rounded-2xl md:bg-white md:ring-1 md:ring-line">
                  {/* Phones: vertical timeline rail */}
                  <span aria-hidden className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-line md:hidden" />
                  {moreUpcoming.map((event) => {
                    const { day, month, year } = parseEventDateParts(event.date, event.endDate);
                    return (
                      <StaggerItem
                        as="li"
                        key={event.id}
                        className="group relative grid scroll-mt-28 grid-cols-[3.25rem_1fr] gap-x-4 gap-y-4 py-5 md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-10 md:p-8"
                      >
                        <div id={eventAnchor(event)} className="relative z-[1] flex h-[3.25rem] flex-col items-center justify-center rounded-xl bg-primary text-white md:block md:h-auto md:rounded-none md:bg-transparent md:text-left md:text-inherit">
                          <p className="font-heading text-[22px] font-extrabold leading-none tracking-[-0.04em] md:text-5xl md:tracking-[-0.05em] md:text-primary">
                            {day}
                          </p>
                          <p className="eyebrow mt-0.5 text-[9px] tracking-[0.12em] text-gold md:mt-2 md:text-[11px] md:tracking-[0.18em] md:text-text-muted">
                            {month}
                            <span className="hidden md:inline"> {year}</span>
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="eyebrow text-[10px] text-gold md:text-[11px]">{event.category}</p>
                          <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-ink md:mt-2 md:text-xl">
                            {event.title}
                          </h3>
                          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-text-muted md:mt-2 md:text-sm">
                            <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {event.venue}
                          </p>
                        </div>
                        <div className="col-start-2 flex items-center gap-3 md:col-start-auto">
                          <RegisterAction event={event} onInterest={setInterestEvent} />
                          <ShareButton event={event} />
                        </div>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
                </>
              ) : null}
            </>
          )}
        </div>
      </section>

      {/* Archive */}
      {past.length > 0 ? (
        <section className="section-y bg-white" aria-labelledby="archive-heading">
          <div className="container-site">
            <Reveal className="mb-6 flex flex-col justify-between gap-3 md:mb-12 md:flex-row md:items-end md:gap-4">
              <div>
                <Eyebrow index="02">Archive</Eyebrow>
                <h2 id="archive-heading" className="display-md mt-5 text-ink">
                  Past events
                </h2>
              </div>
              <ArrowLink href="/media">Browse the media gallery</ArrowLink>
            </Reveal>

            <Stagger className="grid border-t border-line md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:border-0 lg:grid-cols-3">
              {past.slice(0, archiveCount).map((event) => (
                <StaggerItem key={event.id}>
                  <article id={eventAnchor(event)} className="group grid scroll-mt-28 grid-cols-[6rem_1fr] items-start gap-4 border-b border-line py-4 md:block md:border-0 md:py-0">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-mist md:aspect-[4/3] md:rounded-xl">
                      <EventImage event={event} />
                      <span className="eyebrow absolute left-4 top-4 hidden rounded-full bg-white/95 px-3 py-1.5 text-ink md:inline">
                        {formatEventDateLabel(event.date, event.endDate)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="eyebrow text-[10px] text-gold md:mt-5 md:text-[11px]">
                        {event.category}
                        <span className="text-text-muted md:hidden"> · {formatEventDateLabel(event.date, event.endDate)}</span>
                      </p>
                      <h3 className="mt-1.5 line-clamp-3 text-[16px] font-bold leading-snug text-ink md:mt-2 md:line-clamp-none md:text-xl">{event.title}</h3>
                      <p className="mt-2 hidden line-clamp-3 text-[15px] leading-relaxed text-text-muted md:block">
                        {previewText(event.description)}
                      </p>
                      {event.venue ? (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-text-muted md:mt-3 md:text-sm">
                          <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{event.venue}</span>
                        </p>
                      ) : null}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>

            {past.length > archiveCount ? (
              <div className="mt-8 text-center md:mt-14">
                <button
                  type="button"
                  onClick={() => setArchiveCount((n) => n + ARCHIVE_PAGE)}
                  className="btn btn-outline max-md:w-full"
                >
                  Show more past events
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Newsletter */}
      <section className="bg-ivory pb-16 pt-4 md:pb-32" aria-labelledby="newsletter-heading">
        <div className="container-site">
          <Reveal>
            <div className="grain relative grid gap-8 overflow-hidden rounded-2xl bg-primary px-6 py-10 text-white md:gap-10 md:px-14 md:py-16 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="eyebrow text-gold">Newsletter</p>
                <h2 id="newsletter-heading" className="display-md mt-5">
                  Never miss an update
                </h2>
                <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/70 md:mt-5 md:text-lg">
                  Get the latest announcements, program schedules and
                  motivational content delivered to your inbox.
                </p>
              </div>
              <form className="flex flex-col gap-3 sm:flex-row lg:col-span-6" onSubmit={handleSubscribe}>
                <label className="flex-1">
                  <span className="sr-only">Email address</span>
                  <input
                    className="w-full rounded-full border border-white/15 bg-white/10 px-6 py-3.5 text-white outline-none transition-colors placeholder:text-white/45 focus:border-gold focus:bg-white/15 disabled:opacity-70"
                    placeholder="Your email address"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={subscribe.isPending}
                  />
                </label>
                <button className="btn btn-gold group" type="submit" disabled={subscribe.isPending}>
                  {subscribe.isPending ? "Subscribing…" : "Keep me posted"}
                  <FiArrowUpRight className="h-4 w-4" aria-hidden />
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <EventInterestModal event={interestEvent} onClose={() => setInterestEvent(null)} />
    </>
  );
}

function EventMeta({ event }: { event: EventItem }) {
  const { day, month, year } = parseEventDateParts(event.date, event.endDate);
  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-b border-line pb-6">
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-6xl font-extrabold leading-none tracking-[-0.05em] text-primary">
          {day}
        </span>
        <span className="eyebrow text-text-muted">
          {month}
          <br />
          {year}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-gold">{event.category}</p>
        <p className="mt-1.5 text-sm font-medium text-ink">
          {formatEventDateLabel(event.date, event.endDate)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
          <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {event.venue}
        </p>
      </div>
    </div>
  );
}
