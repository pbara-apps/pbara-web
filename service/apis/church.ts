import { useQuery } from "@tanstack/react-query";
import { mapPublicChapter } from "@/lib/mappers/public";
import http from ".";

export const chapterKeys = {
  public: ["chapters", "public"] as const,
};

export const useGetPublicChapters = () =>
  useQuery({
    queryKey: chapterKeys.public,
    queryFn: async () => {
      const res = await http.get("/church/public");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) =>
        mapPublicChapter(item as Parameters<typeof mapPublicChapter>[0]),
      );
    },
  });
