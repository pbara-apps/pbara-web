import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { DirectorDesk } from "@/components/sections/DirectorDesk";
import { HomeSections } from "@/components/sections/HomeSections";
import { executives } from "@/data/executives";
import { newsItems as fallbackNews } from "@/data/news";
import { fetchPublicDirectorDesk } from "@/lib/api/director-desk";
import { fetchPublicHeroStats } from "@/lib/api/hero-stats";
import { fetchPublicNews } from "@/lib/api/news";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://www.pbara.org.ng",
  },
};

export default async function HomePage() {
  const [news, directorDesk, heroStats] = await Promise.all([
    fetchPublicNews(),
    fetchPublicDirectorDesk(),
    fetchPublicHeroStats(),
  ]);
  const newsItems = news.length > 0 ? news : fallbackNews;

  const bulletins = [
    newsItems.find((n) => n.category === "Featured") ?? newsItems[0],
    newsItems.find((n) => n.category === "Report") ?? newsItems[1],
    newsItems.find((n) => n.category === "Upcoming") ?? newsItems[2],
  ].filter(Boolean) as typeof newsItems;

  return (
    <>
      <HeroSection stats={heroStats} />
      <StatsBar />
      <DirectorDesk data={directorDesk} />
      <HomeSections executives={executives} bulletins={bulletins} />
    </>
  );
}
