import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink } from "@/components/site/primitives";
import { org_email } from "@/data/contact";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: {
    canonical: "/terms",
  },
  description: "Terms of service for PBA Royal Ambassadors website.",
};

// TODO(content): the association's full terms of service has not been published yet.
export default function Page() {
  return (
    <>
      <PageHero tone="light" crumbs={[{ label: "Terms of Service" }]} eyebrow="Legal" title="Terms of Service" />
      <section className="bg-ivory pb-24 pt-12 md:pb-32">
        <div className="container-site">
          <div className="max-w-2xl rounded-2xl bg-white p-8 ring-1 ring-line md:p-12">
            <p className="text-lg leading-relaxed text-ink">
              The association&apos;s terms of service is being prepared and will be published
              on this page.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-text-muted">
              If you have a question in the meantime, please contact the
              secretariat at{" "}
              <a href={`mailto:${org_email}`} className="font-semibold text-primary underline decoration-gold underline-offset-4">
                {org_email}
              </a>
              .
            </p>
            <ButtonLink href="/contact" variant="navy" className="mt-8">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
