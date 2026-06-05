import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsPageContent } from "@/components/sections/NewsPageContent";
import { newsItems } from "@/data/news";

export const metadata: Metadata = {
  title: "News and Press",
  description:
    "Official announcements, program updates, and leadership insights from the Royal Ambassadors paramilitary Christian youth organization.",
  openGraph: {
    title: "News & Press | PBA Royal Ambassadors",
    url: "https://pbara.org.ng/news",
  },
  keywords: ["News", "Press", "Announcements", "RA updates", "Bulletin"],
};

function NewsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-text-muted">Loading...</p>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<NewsLoading />}>
      <NewsPageContent news={newsItems} />
    </Suspense>
  );
}
