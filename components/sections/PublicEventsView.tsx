"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiMapPin,
  FiShare2,
} from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import type { EventItem } from "@/types";
import { parseEventDateParts, formatEventDateLabel } from "@/lib/event-date";
import { registrationPath } from "@/lib/api/program";
import { EventInterestModal } from "./EventInterestModal";

const UPCOMING_IMAGES: Record<string, string> = {
  "1": "https://lh3.googleusercontent.com/aida-public/AB6AXuB99MhOLoBFMOWcAcIzkvFtMkvJUAHCLR8GCyC9xSdhfEGcJPK7oFXucX-1GERDH7anSfiJQ0NRG0hvOHyrPS1PBbiphemSOCRCb9qwEP1UYFBBgafaOd8CB-fWaOAZdRcWFPHx3HabxFwKUHKmcp9dhrO2x-N8_wxQu5DEtUG94hkGdT17bBYJbH6_YsV7KohTidZe3JpjReg65T6KjVggzEVGgB9yewEWVwlv2UqcrzerBuihjhUXKFfbHN7ToRlTOjeGfdP7yDA",
  "2": "https://lh3.googleusercontent.com/aida-public/AB6AXuBG65GwJ63uM-Ruu-fOZVbR2vTpek_VheMFMUVpwcjjDD7iPTGH3gORygquTjkfj2cbXL4mzWsSWoQsowlwahPsSEc88XoCVEkCabNbJJCB1OWPYOC1AXx24NAU960b8fPlbuKsSsstQT2b24xMdfpnrZ3W2CtEDnm9Bkz4Z9Hqj558jbZVCmzsqQqzoJppuU7e4ht72kSwKza5-sUkxAIQJN349zo85CW8ypmXEx8wOi8xmFsIye7pD3s21rzRzRybiDaNlZi8uNg",
};

const ARCHIVE_IMAGES: Record<string, string> = {
  "3": "https://lh3.googleusercontent.com/aida-public/AB6AXuDHQ1KRhBbtMqkxoSYzAGzY5w8Ed6p-BRrpDWNuw_OJNw-unNADgINEkbBIKix8aX9r5oTVOFXHXcY0NooD9qVPcgscNYhzh0OilJid2Qk9np36pH4UkEeRlg8bcV3q75rFjpamgVgA6UQsn8QEivsLxYCTSaW90jCCDIzjuExj1cNY7_tZ_2WeZyiKtAYi_Yxx5t7evnPhRRZHvHwcdHe_ro1qq5hMmMlmAQJcGg1S8YGebx5iAugLiLNV4jeVK33gDbqZ2BVrKtA",
  "4": "https://lh3.googleusercontent.com/aida-public/AB6AXuBk-oMpT-xv_EFR_IteaaFLVskHyhhXTedNK3Kqt5FH8sLh8hHzBnxPPNUAiB6O8c0u_HYsBprkzYoyd2uWgFzsqmVWJQILYyI37_CtvQvSR4wJlYD8MUF5hDfZyRybTyQE2vY6IYT7Ty8X_bcS__aciOBW72cqlN2hQ2lvcgcQ8njzm0_TL7RA_S4g8hMAG0H8pT5hz7jFSbAG06luU2WML3qhIcWVoij9Wdw407OuwWDzFecmuZtczWK9i_d69k6FQ_Nh3P4Y3zg",
  "5": "https://lh3.googleusercontent.com/aida-public/AB6AXuDdkEuSp2Oqn4m6Xx5po6O-mXR4ntMHjeA10OsVgnhzQXjtxX2HfkpkIQMSvt6qyVglK_FmKnFgwXljRThflQoLDGAUYsOX2ruxUfs3aFGnXZq5OOJRSAyqeirkg0_U2PaIHhkVAmUrxyhW4-ckUjZIRkyYMVzK-tlpi4R7UccChcWo0ZrGUHlMWo65-bTKQHmkAsd1BIinm_bbvb7CaRDbuId0ckf78kjYSlDZnGgRiRGNIBnJkgcHdqq905Dn4tOjYmpwiXVUipM",
};

export function PublicEventsView({
  upcomingEvents,
  pastEvents,
}: {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
}) {
  const [interestEvent, setInterestEvent] = useState<EventItem | null>(null);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <div className="px-4 md:px-10 lg:px-40 py-8">
        <div className="@container">
          <div className="overflow-hidden rounded-xl h-[320px] relative">
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/event-cv.jpeg')` }}
              role="img"
              aria-label="Christian youth gathering in a large hall for ceremony"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <span className="inline-block px-3 py-1 bg-accent-gold text-slate-900 text-xs font-bold uppercase rounded mb-3">
                Featured Program
              </span>
              <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
                Events and Programs
              </h1>
              <p className="text-slate-200 mt-2 max-w-2xl text-lg">
                Strengthening the faith and discipline of young men through
                dedicated fellowship and service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Programs Section */}
      <section
        className="px-4 md:px-10 lg:px-40 py-10"
        aria-labelledby="upcoming-heading"
      >
        <div className="flex items-center justify-between mb-8 border-l-4 border-accent-gold pl-4">
          <div>
            <h2
              id="upcoming-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Upcoming Programs
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Join our scheduled activities and developmental sessions
            </p>
          </div>
          <Link
            href="/events#calendar"
            className="text-primary font-semibold flex items-center gap-2 hover:underline"
          >
            View Full Calendar <FiCalendar size={18} aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6">
          {upcomingEvents.map((event) => {
            const { day, month, year } = parseEventDateParts(
              event.date,
              event.endDate,
            );
            const categoryLabel =
              event.category === "Golden Ambassador"
                ? "Golden Jubilee"
                : event.category;
            const leftBg =
              event.id === "1"
                ? "bg-primary/10 dark:bg-primary/20"
                : "bg-slate-50 dark:bg-slate-800";
            const leftDayColor =
              event.id === "1" ? "text-primary" : "text-slate-400";
            const rightImage = event.image ?? UPCOMING_IMAGES[event.id];

            return (
              <div
                key={event.id}
                className="flex flex-col md:flex-row items-stretch bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden group"
              >
                <div
                  className={`md:w-1/4 ${leftBg} flex flex-col items-center justify-center p-6 text-center border-r border-slate-100 dark:border-slate-800`}
                >
                  <span className={`${leftDayColor} font-bold text-5xl`}>
                    {day}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold text-xl uppercase">
                    {month}
                  </span>
                  <span className="text-slate-400 text-sm mt-1">{year}</span>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded">
                        {categoryLabel}
                      </span>
                      <span className="flex items-center text-xs text-slate-500">
                        <FiMapPin
                          size={14}
                          className="mr-1 shrink-0"
                          aria-hidden
                        />
                        {event.venue}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    {event.registrationProgramSlug ? (
                      <Link
                        href={registrationPath(event.registrationProgramSlug)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-accent-gold text-slate-900 font-bold rounded-lg hover:brightness-110 transition-all"
                      >
                        Register Now <FiArrowRight size={18} aria-hidden />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInterestEvent(event)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-accent-gold text-slate-900 font-bold rounded-lg hover:brightness-110 transition-all"
                      >
                        Register Now <FiArrowRight size={18} aria-hidden />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      aria-label="Share event"
                    >
                      <FiShare2 size={18} aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="hidden lg:block w-1/3 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={
                      rightImage
                        ? { backgroundImage: `url('${rightImage}')` }
                        : undefined
                    }
                    role={rightImage ? "img" : undefined}
                    aria-label={rightImage ? "Event image" : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Past Events Archive Section */}
      <section
        className="px-4 md:px-10 lg:px-40 py-16 bg-slate-100 dark:bg-slate-900/50"
        aria-labelledby="archive-heading"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2
              id="archive-heading"
              className="text-2xl font-bold tracking-tight"
            >
              Past Events Archive
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Reflecting on our milestones and past ceremonies
            </p>
          </div>
          <div className="flex gap-2" aria-label="Archive navigation">
            <button
              type="button"
              className="size-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous"
            >
              <FiChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              className="size-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Next"
            >
              <FiChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event) => {
            const image = event.image ?? ARCHIVE_IMAGES[event.id];
            const cta =
              event.id === "3"
                ? "View Gallery"
                : event.id === "4"
                  ? "View Summary"
                  : "Read Report";
            return (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={
                      image ? { backgroundImage: `url('${image}')` } : undefined
                    }
                    role={image ? "img" : undefined}
                    aria-label={image ? "Event photo" : undefined}
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/60 text-white text-[10px] rounded backdrop-blur-md">
                    {formatEventDateLabel(event.date, event.endDate)}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {event.description}
                  </p>
                  <Link
                    href="#"
                    className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {cta} <FiExternalLink size={14} aria-hidden />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            className="px-8 py-3 bg-transparent border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Load More From Archive
          </button>
        </div>
      </section>

      {/* Newsletter / Call to Action */}
      <section
        className="px-4 md:px-10 lg:px-40 py-20"
        aria-labelledby="newsletter-heading"
      >
        <div className="bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="absolute -right-20 -top-20 opacity-10" aria-hidden>
            <HiOutlineShieldCheck size={300} />
          </div>
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2
              id="newsletter-heading"
              className="text-3xl font-bold text-white mb-4"
            >
              Never miss an update
            </h2>
            <p className="text-slate-100 text-lg">
              Subscribe to our monthly newsletter to get the latest
              announcements, program schedules, and motivational content
              delivered to your inbox.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                className="px-6 py-3 rounded-lg border-none focus:ring-2 focus:ring-accent-gold min-w-[280px] text-slate-900"
                placeholder="Your email address"
                type="email"
              />
              <button
                className="bg-accent-gold text-slate-900 font-bold px-8 py-3 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
                type="submit"
              >
                Keep me posted
              </button>
            </form>
          </div>
        </div>
      </section>

      <EventInterestModal
        event={interestEvent}
        onClose={() => setInterestEvent(null)}
      />
    </main>
  );
}
