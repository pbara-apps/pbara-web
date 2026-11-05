import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { IdentitySection } from "@/components/sections/IdentitySection";
import { MissionBand } from "@/components/sections/MissionBand";
import { ProgramsShowcase } from "@/components/sections/ProgramsShowcase";
import { DirectorDesk } from "@/components/sections/DirectorDesk";
import { OpenRegistrationsSection } from "@/components/sections/OpenRegistrationsSection";
import {
  ClosingCta,
  HomeChapters,
  HomeLeadership,
  HomeNews,
} from "@/components/sections/HomeSections";
import { newsItems as fallbackNews } from "@/data/news";
import { fetchPublicDirectorDesk } from "@/lib/api/director-desk";
import { fetchPublicHeroStats } from "@/lib/api/hero-stats";
import { fetchPublicNews } from "@/lib/api/news";
import { fetchOpenPublicPrograms } from "@/lib/api/program";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://pbara.org.ng",
  },
};

export default async function HomePage() {
  const [news, directorDesk, heroStats, openPrograms] = await Promise.all([
    fetchPublicNews(),
    fetchPublicDirectorDesk(),
    fetchPublicHeroStats(),
    fetchOpenPublicPrograms(),
  ]);
  const newsItems = news.length > 0 ? news : fallbackNews;

  return (
    <>
      <HeroSection />
      <StatsBar stats={heroStats} />
      <IdentitySection />
      <MissionBand />
      <ProgramsShowcase />
      <OpenRegistrationsSection
        programs={openPrograms.slice(0, 3)}
        totalCount={openPrograms.length}
      />
      <DirectorDesk data={directorDesk} compact />
      <HomeLeadership />
      <HomeChapters />
      <HomeNews items={newsItems.slice(0, 4)} />
      <ClosingCta />
    </>
  );
}
