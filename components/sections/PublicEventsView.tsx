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
          <Reveal className="mb-12 flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
            <div>
              <Eyebrow index="01">Upcoming</Eyebrow>
              <h2 id="upcoming-heading" className="display-md mt-5 text-ink">
                Upcoming programs
              </h2>
            </div>
            <p className="max-w-md text-[16px] text-text-muted">
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
                className="group grid scroll-mt-28 overflow-hidden rounded-2xl bg-white ring-1 ring-line lg:grid-cols-12"
              >
                <ImageReveal className="aspect-[4/3] bg-primary lg:col-span-6 lg:aspect-auto lg:min-h-[32rem]">
                  <EventImage event={lead} />
                </ImageReveal>
                <div className="flex flex-col p-8 md:p-12 lg:col-span-6">
                  <EventMeta event={lead} />
                  <h3 className="display-md mt-6 text-balance text-ink">{lead.title}</h3>
                  <p className="mt-5 line-clamp-[8] whitespace-pre-line text-[16px] leading-relaxed text-text-muted">
                    {lead.description}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-10">
                    <RegisterAction event={lead} onInterest={setInterestEvent} />
                    <ShareButton event={lead} />
                  </div>
                </div>
              </article>

              {/* Remaining upcoming */}
              {moreUpcoming.length > 0 ? (
                <Stagger as="ol" className="mt-6 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                  {moreUpcoming.map((event) => {
                    const { day, month, year } = parseEventDateParts(event.date, event.endDate);
                    return (
                      <StaggerItem
                        as="li"
                        key={event.id}
                        className="group grid scroll-mt-28 gap-6 p-6 md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-10 md:p-8"
                      >
                        <div id={eventAnchor(event)} className="flex items-baseline gap-2 md:block">
                          <p className="font-heading text-5xl font-extrabold leading-none tracking-[-0.05em] text-primary">
                            {day}
                          </p>
                          <p className="eyebrow mt-2 text-text-muted">
                            {month} {year}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="eyebrow text-gold">{event.category}</p>
                          <h3 className="mt-2 text-xl font-bold leading-snug text-ink">
                            {event.title}
                          </h3>
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
                            <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                            {event.venue}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <RegisterAction event={event} onInterest={setInterestEvent} />
                          <ShareButton event={event} />
                        </div>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              ) : null}
            </>
          )}
        </div>
      </section>

      {/* Archive */}
      {past.length > 0 ? (
        <section className="section-y bg-white" aria-labelledby="archive-heading">
          <div className="container-site">
            <Reveal className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Eyebrow index="02">Archive</Eyebrow>
                <h2 id="archive-heading" className="display-md mt-5 text-ink">
                  Past events
                </h2>
              </div>
              <ArrowLink href="/media">Browse the media gallery</ArrowLink>
            </Reveal>

            <Stagger className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {past.slice(0, archiveCount).map((event) => (
                <StaggerItem key={event.id}>
                  <article id={eventAnchor(event)} className="group scroll-mt-28">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist">
                      <EventImage event={event} />
                      <span className="eyebrow absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-ink">
                        {formatEventDateLabel(event.date, event.endDate)}
                      </span>
                    </div>
                    <p className="eyebrow mt-5 text-gold">{event.category}</p>
                    <h3 className="mt-2 text-xl font-bold leading-snug text-ink">{event.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-text-muted">
                      {previewText(event.description)}
                    </p>
                    {event.venue ? (
                      <p className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
                        <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {event.venue}
                      </p>
                    ) : null}
                  </article>
                </StaggerItem>
              ))}
            </Stagger>

            {past.length > archiveCount ? (
              <div className="mt-14 text-center">
                <button
                  type="button"
                  onClick={() => setArchiveCount((n) => n + ARCHIVE_PAGE)}
                  className="btn btn-outline"
                >
                  Show more past events
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Newsletter */}
      <section className="bg-ivory pb-24 pt-4 md:pb-32" aria-labelledby="newsletter-heading">
        <div className="container-site">
          <Reveal>
            <div className="grain relative grid gap-10 overflow-hidden rounded-2xl bg-primary px-8 py-14 text-white md:px-14 md:py-16 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="eyebrow text-gold">Newsletter</p>
                <h2 id="newsletter-heading" className="display-md mt-5">
                  Never miss an update
                </h2>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
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
