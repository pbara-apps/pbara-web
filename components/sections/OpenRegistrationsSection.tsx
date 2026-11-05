"use client";

import Image from "next/image";
import {
  RegistrationProgramCard,
  formatAmount,
  formatDeadline,
} from "@/components/registration/RegistrationProgramCard";
import { ImageReveal, Reveal } from "@/components/site/motion";
import { ArrowLink, ButtonLink } from "@/components/site/primitives";
import { registrationPath } from "@/lib/api/program";
import { previewText } from "@/lib/format";
import type { RegistrationProgram } from "@/types";

interface OpenRegistrationsSectionProps {
  programs: RegistrationProgram[];
  /** Total open programs (may be more than the preview list). */
  totalCount?: number;
}

/**
 * Homepage band that spotlights programs currently open for registration.
 * Hidden when nothing is open.
 */
export function OpenRegistrationsSection({
  programs,
  totalCount,
}: OpenRegistrationsSectionProps) {
  if (programs.length === 0) return null;

  const [lead, ...rest] = programs;
  const total = totalCount ?? programs.length;
  const deadline = formatDeadline(lead.registrationDeadline);

  return (
    <section
      className="bg-white py-20 md:py-24"
      aria-labelledby="open-registrations-heading"
    >
      <div className="container-site">
        <div className="grid overflow-hidden rounded-2xl bg-ink text-white lg:grid-cols-12">
          <div className="relative min-h-[18rem] lg:col-span-5">
            <ImageReveal className="absolute inset-0">
              {lead.flyerImageUrl ? (
                <Image
                  src={lead.flyerImageUrl}
                  alt={`${lead.title} flyer`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/images/ra-parade.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              )}
            </ImageReveal>
          </div>

          <div className="flex flex-col p-8 md:p-12 lg:col-span-7 lg:p-14">
            <Reveal>
              <p className="eyebrow flex items-center gap-2.5 text-gold">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Registration open
              </p>
              <h2
                id="open-registrations-heading"
                className="display-md mt-6 text-balance"
              >
                {lead.title}
              </h2>
              {lead.description ? (
                <p className="mt-5 line-clamp-4 max-w-xl text-[16px] leading-relaxed text-white/70">
                  {previewText(lead.description)}
                </p>
              ) : null}
            </Reveal>

            <Reveal delay={0.1} className="mt-auto pt-10">
              <dl className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="eyebrow text-white/45">Fee</dt>
                  <dd className="mt-1.5 text-xl font-bold">{formatAmount(lead.amount)}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-white/45">Closes</dt>
                  <dd className="mt-1.5 text-xl font-bold">{deadline ?? "Open"}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="eyebrow text-white/45">Category</dt>
                  <dd className="mt-1.5 text-xl font-bold capitalize">{lead.category}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={registrationPath(lead.slug)} variant="gold">
                  Register now
                </ButtonLink>
                {total > 1 ? (
                  <ButtonLink href="/registration" variant="outline-light">
                    All {total} open programs
                  </ButtonLink>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>

        {rest.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((p) => (
              <RegistrationProgramCard key={p.id} program={p} />
            ))}
          </div>
        ) : null}

        {total > programs.length ? (
          <div className="mt-6">
            <ArrowLink href="/registration">See every open registration</ArrowLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
