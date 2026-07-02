import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pbara.org.ng";
  const lastModified = new Date();

  const routes = [
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
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
