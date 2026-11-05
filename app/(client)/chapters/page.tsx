import type { Metadata } from "next";
import { Suspense } from "react";
import { ChaptersDirectory } from "@/components/sections/ChaptersDirectory";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Chapters and Units",
  alternates: {
    canonical: "/chapters",
  },
  description:
    "Discover Royal Ambassador local units fostering leadership and spiritual growth across our Baptist Association.",
  openGraph: {
    title: "Chapters & Units | PBA Royal Ambassadors",
    description: "Local RA chapters and units across the association.",
    url: "https://pbara.org.ng/chapters",
  },
  keywords: ["Chapters", "Units", "Royal Ambassadors", "PBA RA"],
};

export default function ChaptersPage() {
  return (
    <>
      <PageHero
        tone="light"
        crumbs={[{ label: "Chapters" }]}
        eyebrow="Association network"
        title="Our chapters and units"
        description="Royal Ambassador chapters meet in local churches across the Pentecost Baptist Association, fostering leadership and spiritual growth. Search the directory to find one near you."
      />
      <section className="bg-ivory pb-24 pt-10 md:pb-32">
        <div className="container-site">
          <Suspense fallback={<div className="h-20" />}>
            <ChaptersDirectory />
          </Suspense>
        </div>
      </section>
    </>
  );
}
