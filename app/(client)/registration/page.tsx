import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationProgramCard } from "@/components/registration/RegistrationProgramCard";
import { fetchOpenPublicPrograms } from "@/lib/api/program";

export const metadata: Metadata = {
  title: "Open Registrations",
  description:
    "Browse active PBA Royal Ambassadors program registrations and complete payment online.",
  alternates: {
    canonical: "/registration",
  },
};

export default async function RegisterIndexPage() {
  const programs = await fetchOpenPublicPrograms();

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(200,168,75,0.14),_transparent_60%),linear-gradient(180deg,_rgba(27,36,82,0.06),_transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <header className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Registrations
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Open registrations
          </h1>
          <p className="mt-3 text-base text-text-muted">
            Select a program to view payment details and submit your
            registration.
          </p>
        </header>

        {programs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-primary">
              No open registrations right now
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-text-muted">
              When a program opens for registration, it will appear here. You
              can also check News or contact headquarters for updates.
            </p>
            <Link
              href="/news"
              className="mt-6 inline-flex min-h-[44px] items-center text-sm font-bold text-primary hover:text-gold"
            >
              Browse news
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <RegistrationProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
