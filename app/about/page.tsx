import type { Metadata } from "next";
import Image from "next/image";
import { AboutPageContent } from "@/components/sections/AboutPageContent";
import { patrons } from "@/data/patrons";

export const metadata: Metadata = {
  title: "About Us",
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

export default function AboutPage() {
  const aboutPatrons = patrons.slice(0, 3);

  return (
    <>
      <section
        className="relative min-h-[400px] flex flex-col justify-end text-white overflow-hidden"
        aria-labelledby="about-hero-title"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/image1.jpeg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(27,46,90,0.35) 0%, rgba(27,46,90,0.88) 100%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 py-14 md:py-16">
          <h1
            id="about-hero-title"
            className="font-heading text-4xl md:text-5xl font-bold"
          >
            About Us
          </h1>
          <p className="text-white/90 mt-2 max-w-2xl text-base md:text-lg">
            Our heritage, vision, and mission to develop godly young men.
          </p>
        </div>
      </section>

      <AboutPageContent patrons={aboutPatrons} />
    </>
  );
}
