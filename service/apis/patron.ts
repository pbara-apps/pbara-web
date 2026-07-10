import { useQuery } from "@tanstack/react-query";
import { mapPublicPatron } from "@/lib/mappers/public";
import http from ".";

export const patronKeys = {
  public: ["patrons", "public"] as const,
};

export const useGetPublicPatrons = () =>
  useQuery({
    queryKey: patronKeys.public,
    queryFn: async () => {
      const res = await http.get("/patron/public");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) =>
        mapPublicPatron(item as Parameters<typeof mapPublicPatron>[0]),
      );
    },
  });
