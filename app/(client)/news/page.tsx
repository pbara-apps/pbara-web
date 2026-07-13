import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsPageContent } from "@/components/sections/NewsPageContent";
import { newsItems as fallbackNews } from "@/data/news";
import { fetchPublicNews } from "@/lib/api/news";

export const metadata: Metadata = {
  title: "News and Press",
  alternates: {
    canonical: "/news",
  },
  description:
    "Official announcements, program updates, and leadership insights from the Royal Ambassadors paramilitary Christian youth organization.",
  openGraph: {
    title: "News & Press | PBA Royal Ambassadors",
    url: "https://www.pbara.org.ng/news",
  },
  keywords: ["News", "Press", "Announcements", "RA updates", "Bulletin"],
};

function NewsListFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-text-muted">Loading news…</p>
    </div>
  );
}

export default async function NewsPage() {
  const news = await fetchPublicNews();
  const items = news.length > 0 ? news : fallbackNews;

  return (
    <Suspense fallback={<NewsListFallback />}>
      <NewsPageContent news={items} />
    </Suspense>
  );
}
