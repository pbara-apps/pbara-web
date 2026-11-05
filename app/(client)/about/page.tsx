import type { Metadata } from "next";
import {
  AboutHistory,
  AboutIntro,
  AboutObjectives,
  AboutPhilosophy,
  AboutPledge,
} from "@/components/sections/AboutPageContent";
import { MissionBand } from "@/components/sections/MissionBand";
import { DirectorDesk } from "@/components/sections/DirectorDesk";
import { StatsBar } from "@/components/sections/StatsBar";
import { ClosingCta } from "@/components/sections/HomeSections";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink } from "@/components/site/primitives";
import { fetchPublicDirectorDesk } from "@/lib/api/director-desk";
import { fetchPublicHeroStats } from "@/lib/api/hero-stats";

export const metadata: Metadata = {
  title: "About Us",
  alternates: {
    canonical: "/about",
  },
  description:
    "Learn about the Royal Ambassadors of Nigeria, our heritage, vision, mission, and the Pentecost Baptist Association RA. Meet our patrons and discover how we develop young men for Christ.",
  openGraph: {
    title: "About Us | PBA Royal Ambassadors",
    url: "https://pbara.org.ng/about",
  },
  keywords: [
    "About",
    "Vision",
    "Mission",
    "Cardinal objectives",
    "Patrons",
    "Royal Ambassadors",
  ],
};

export default async function AboutPage() {
  const [directorDesk, stats] = await Promise.all([
    fetchPublicDirectorDesk(),
    fetchPublicHeroStats(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "About us" }]}
        eyebrow="About the Royal Ambassadors"
        title={
          <>
            Our heritage. Our identity.{" "}
            <span className="italic text-gold">Our calling.</span>
          </>
        }
        description="Our heritage, vision, and mission to develop godly young men — from a worldwide Baptist movement to the chapters of the Pentecost Baptist Association."
        image="/images/ra-assembly.jpg"
        imagePosition="center 30%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#mission" variant="gold">
            Mission &amp; vision
          </ButtonLink>
          <ButtonLink href="#history" variant="outline-light">
            Our history
          </ButtonLink>
        </div>
      </PageHero>

      <AboutIntro />
      <AboutHistory />
      <MissionBand id="mission" index="03" />
      <AboutPhilosophy />
      <AboutObjectives />
      <AboutPledge />
      <StatsBar stats={stats} />
      <DirectorDesk data={directorDesk} id="director" index="07" />
      <ClosingCta />
    </>
  );
}
