import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapters and Units",
  description:
    "Discover Royal Ambassador chapters and units across the Pentecost Baptist Association. Find a chapter near you.",
  openGraph: {
    title: "Our Chapters | PBA Royal Ambassadors",
    url: "https://pbara.org.ng/chapters",
  },
  keywords: ["Chapters", "Units", "Find a chapter", "PBA RA network"],
};

export default function ChaptersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
