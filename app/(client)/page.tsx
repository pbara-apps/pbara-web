import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { DirectorDesk } from "@/components/sections/DirectorDesk";
import { HomeSections } from "@/components/sections/HomeSections";
import { executives } from "@/data/executives";
import { newsItems } from "@/data/news";

export default function HomePage() {
  const bulletins = [
    newsItems.find((n) => n.category === "Featured") ?? newsItems[0],
    newsItems.find((n) => n.category === "Report") ?? newsItems[1],
    newsItems.find((n) => n.category === "Upcoming") ?? newsItems[2],
  ].filter(Boolean) as typeof newsItems;

  return (
    <>
      <HeroSection />
      <StatsBar />
      <DirectorDesk />
      <HomeSections executives={executives} bulletins={bulletins} />
    </>
  );
}
