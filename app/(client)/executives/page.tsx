import type { Metadata } from "next";
import { PastOfficersTable } from "@/components/ui/PastOfficersTable";
import { CurrentExecutivesGrid } from "@/components/sections/CurrentExecutivesGrid";
import { ChapterCounsellorsGrid } from "@/components/sections/ChapterCounsellorsGrid";
import { PatronsSection } from "@/components/sections/CurrentPatronsGrid";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, Eyebrow } from "@/components/site/primitives";
import { pastOfficers } from "@/data/pastOfficers";

export const metadata: Metadata = {
  title: "Executive Leadership and Patrons",
  alternates: {
    canonical: "/executives",
  },
  description:
    "Meet the dedicated officers and patrons guiding the Royal Ambassadors of Pentecost Baptist Association. Our leadership is committed to fostering spiritual growth and discipline.",
  openGraph: {
    title: "Executive Leadership | PBA Royal Ambassadors",
    description: "Current executive officers, chapter counsellors, past officers, and our patrons.",
    url: "https://pbara.org.ng/executives",
  },
  keywords: ["Leadership", "Executive", "Patrons", "Officers", "Counsellors", "PBA RA"],
};

export default function ExecutivesPage() {
  return (
    <>
      <PageHero
        tone="light"
        crumbs={[{ label: "Leadership" }]}
        eyebrow="Executive leadership & patrons"
        title="Leadership committed to faith and discipline."
        description="Meet the dedicated officers and patrons guiding the Royal Ambassadors of Pentecost Baptist Association, committed to fostering spiritual growth and discipline."
        image="/images/ra-officers-salute.jpg"
        imageAlt="Association officers in uniform saluting on the parade ground"
        imagePosition="center 35%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#current-officers" variant="navy">
            Meet the council
          </ButtonLink>
          <ButtonLink href="/about" variant="outline">
            Our mission
          </ButtonLink>
        </div>
      </PageHero>

      <section id="current-officers" className="section-y bg-ivory" aria-labelledby="officers-heading">
        <div className="container-site">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow index="01">Current officers</Eyebrow>
              <h2 id="officers-heading" className="display-md mt-5 text-ink">
                The Executive Council
              </h2>
            </div>
          </div>
          <CurrentExecutivesGrid />
        </div>
      </section>

      <section id="chapter-counsellors" className="section-y bg-white" aria-labelledby="counsellors-heading">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <Eyebrow index="02">In every church</Eyebrow>
            <h2 id="counsellors-heading" className="display-md mt-5 text-ink">
              Chapter Counsellors
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
              Each church has a counsellor who guides its Royal Ambassadors chapters, supports their
              presidents and secretaries, and keeps the association connected to every congregation.
            </p>
          </div>
          <ChapterCounsellorsGrid />
        </div>
      </section>

      <section className="section-y bg-ivory" aria-labelledby="past-heading">
        <div className="container-site">
          <div className="mb-14">
            <Eyebrow index="03">Roll of honour</Eyebrow>
            <h2 id="past-heading" className="display-md mt-5 text-ink">
              Past officers
            </h2>
          </div>
          <PastOfficersTable officers={pastOfficers} />
        </div>
      </section>

      <PatronsSection />
    </>
  );
}
