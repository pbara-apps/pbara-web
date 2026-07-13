import type { MetadataRoute } from "next";
import { fetchPublicNews, newsArticlePath } from "@/lib/api/news";
import { newsItems as fallbackNews } from "@/data/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pbara.org.ng";
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/events",
    "/chapters",
    "/executives",
    "/media",
    "/news",
    "/contact",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const news = await fetchPublicNews();
  const articles = (news.length > 0 ? news : fallbackNews).map((item) => ({
    url: `${baseUrl}${newsArticlePath(item)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articles];
}
