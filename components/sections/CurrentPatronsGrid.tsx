"use client";

import { patrons as fallbackPatrons } from "@/data/patrons";
import { useGetPublicPatrons } from "@/service/apis/patron";
import { PersonPhoto } from "@/components/site/PersonPhoto";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";

/** Strip quote marks admins sometimes include in the stored quote. */
function cleanQuote(q: string) {
  return q.trim().replace(/^["“”']+|["“”']+$/g, "");
}

export function CurrentPatronsGrid() {
  const { data, isLoading, isError } = useGetPublicPatrons();
  const list =
    data && data.length > 0 ? data : isError ? fallbackPatrons : (data ?? []);

  if (isLoading && !data) {
    return <div className="h-48 animate-pulse rounded-xl bg-white/5" aria-hidden />;
  }

  if (!list || list.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 px-6 py-14 text-center text-sm text-white/60">
        Patrons will appear here once published from the admin portal.
      </p>
    );
  }

  return (
    <Stagger className="grid gap-5 md:grid-cols-2">
      {list.map((patron) => (
        <StaggerItem key={patron.id}>
          <figure className="flex h-full flex-col gap-8 rounded-xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center md:p-10">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/50 ring-offset-4 ring-offset-ink">
              <PersonPhoto src={patron.image} name={patron.name} logoClassName="w-[70%]" />
            </div>
            <div>
              <blockquote className="text-xl font-semibold leading-snug tracking-[-0.01em] text-white">
                “{cleanQuote(patron.quote)}”
              </blockquote>
              <figcaption className="mt-5">
                <span className="block font-bold text-white">{patron.name}</span>
                <span className="eyebrow mt-1 block text-gold">{patron.role}</span>
              </figcaption>
            </div>
          </figure>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function PatronsSection() {
  return (
    <section className="grain relative bg-ink text-white" aria-labelledby="patrons-heading">
      <div className="container-site section-y">
        <Reveal className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold">Patrons</p>
            <h2 id="patrons-heading" className="display-md mt-5">
              Our patrons
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-white/65 lg:col-span-5">
            Dignified elders and leaders providing spiritual guidance and
            support to the association.
          </p>
        </Reveal>
        <CurrentPatronsGrid />
      </div>
    </section>
  );
}
