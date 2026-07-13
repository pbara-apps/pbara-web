import type { Metadata } from "next";
import { ChaptersDirectory } from "@/components/sections/ChaptersDirectory";

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
    url: "https://www.pbara.org.ng/chapters",
  },
  keywords: ["Chapters", "Units", "Royal Ambassadors", "PBA RA"],
};

export default function ChaptersPage() {
  return (
    <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-accent-gold font-bold uppercase tracking-widest text-xs">
            <span className="h-px w-8 bg-accent-gold" aria-hidden />
            Association Network
          </div>
          <h1 className="text-navy-deep dark:text-white text-4xl md:text-5xl font-black tracking-tight">
            Our Chapters and Units
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Discover the dedicated Royal Ambassador local units fostering
            leadership and spiritual growth across our Baptist Association.
          </p>
        </div>
      </div>

      <ChaptersDirectory />
    </main>
  );
}
