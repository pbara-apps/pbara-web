import type { Metadata } from "next";
import { PublicNewsPage } from "@/components/sections/PublicNewsPage";

export const metadata: Metadata = {
  title: "News and Press",
  alternates: {
    canonical: "/news",
  },
  description:
    "Official announcements, program updates, and leadership insights from the Royal Ambassadors paramilitary Christian youth organization.",
  openGraph: {
    title: "News & Press | PBA Royal Ambassadors",
    url: "https://pbara.org.ng/news",
  },
  keywords: ["News", "Press", "Announcements", "RA updates", "Bulletin"],
};

export default function NewsPage() {
  return <PublicNewsPage />;
}
