import { useQuery } from "@tanstack/react-query";
import { mapPublicExecutive } from "@/lib/mappers/public";
import http from ".";

export const executiveKeys = {
  public: ["executives", "public"] as const,
};

export const useGetPublicExecutives = () =>
  useQuery({
    queryKey: executiveKeys.public,
    queryFn: async () => {
      const res = await http.get("/executive/public");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) =>
        mapPublicExecutive(item as Parameters<typeof mapPublicExecutive>[0]),
      );
    },
  });
