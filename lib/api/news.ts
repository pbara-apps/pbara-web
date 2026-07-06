import { mapPublicNews, mapPublicNewsDetail } from "@/lib/mappers/admin";
import type { NewsDetail, NewsItem } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api";

type ApiListResponse<T> = {
  data?: T[];
};

type ApiArticleResponse = {
  data?: {
    article: Parameters<typeof mapPublicNewsDetail>[0];
    related: Parameters<typeof mapPublicNews>[0][];
  };
};

export async function fetchPublicNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_URL}/news/public`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiListResponse<
      Parameters<typeof mapPublicNews>[0]
    >;
    const list = json.data ?? [];
    return list.map((item) => mapPublicNews(item));
  } catch {
    return [];
  }
}

export async function fetchPublicNewsArticle(
  idOrSlug: string,
): Promise<{ article: NewsDetail; related: NewsItem[] } | null> {
  try {
    const res = await fetch(`${API_URL}/news/public/${idOrSlug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiArticleResponse;
    if (!json.data?.article) return null;

    return {
      article: mapPublicNewsDetail(json.data.article),
      related: (json.data.related ?? []).map((item) => mapPublicNews(item)),
    };
  } catch {
    return null;
  }
}

export function newsArticlePath(item: Pick<NewsItem, "id" | "slug">) {
  return `/news/${item.slug ?? item.id}`;
}
