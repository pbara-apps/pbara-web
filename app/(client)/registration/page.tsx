import type { Metadata } from "next";
import { RegistrationProgramCard } from "@/components/registration/RegistrationProgramCard";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink } from "@/components/site/primitives";
import { fetchOpenPublicPrograms } from "@/lib/api/program";

export const metadata: Metadata = {
  title: "Open Registrations",
  description:
    "Browse active PBA Royal Ambassadors program registrations and complete payment online.",
  alternates: {
    canonical: "/registration",
  },
};

const STEPS = [
  { n: "01", title: "Choose a program", body: "Pick an open program below to see its fee and payment details." },
  { n: "02", title: "Make payment", body: "Pay into the program account and keep your proof of payment." },
  { n: "03", title: "Submit your entry", body: "Register yourself or your chapter and upload the payment proof." },
];

export default async function RegisterIndexPage() {
  const programs = await fetchOpenPublicPrograms();

  return (
    <>
      <PageHero
        tone="light"
        crumbs={[{ label: "Programs", href: "/events" }, { label: "Registrations" }]}
        eyebrow="Registrations"
        title="Open registrations"
        description="Select a program to view payment details and submit your registration — individually or for your whole chapter."
      />

      <section className="bg-ivory pb-16 pt-6 md:pb-32 md:pt-12">
        <div className="container-site">
          <ol className="mb-10 grid gap-px overflow-hidden rounded-xl bg-line md:mb-14 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="grid grid-cols-[2rem_1fr] bg-white px-5 py-4 md:block md:p-7">
                <span className="pt-1 font-mono text-[11px] text-gold md:pt-0">{s.n}</span>
                <p className="text-[16px] font-bold text-ink md:mt-4 md:text-lg">{s.title}</p>
                <p className="col-start-2 mt-1 text-[14px] text-text-muted md:mt-1.5 md:text-[15px]">{s.body}</p>
              </li>
            ))}
          </ol>

          {programs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center md:px-8 md:py-20">
              <h2 className="heading-sm text-ink">No open registrations right now</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-text-muted">
                When a program opens for registration, it will appear here. You
                can also check the newsroom or contact the secretariat for
                updates.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/news" variant="navy">Browse news</ButtonLink>
                <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <RegistrationProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
