import { useQuery } from "@tanstack/react-query";
import { mapPublicRank } from "@/lib/mappers/public";
import http from ".";

export const rankKeys = {
  public: ["ranks", "public"] as const,
};

export const useGetPublicRanks = () =>
  useQuery({
    queryKey: rankKeys.public,
    queryFn: async () => {
      const res = await http.get("/rank/public");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) =>
        mapPublicRank(item as Parameters<typeof mapPublicRank>[0]),
      );
    },
  });
