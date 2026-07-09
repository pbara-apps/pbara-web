import { useQuery } from "@tanstack/react-query";
import { mapPublicNews } from "@/lib/mappers/public";
import http from ".";

export const newsKeys = {
  public: ["news", "public"] as const,
};

export const useGetPublicNews = () =>
  useQuery({
    queryKey: newsKeys.public,
    queryFn: async () => {
      const res = await http.get("/news/public");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) => mapPublicNews(item as Parameters<typeof mapPublicNews>[0]));
    },
  });
