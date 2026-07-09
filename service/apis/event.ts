import { useQuery } from "@tanstack/react-query";
import { mapPublicEvent } from "@/lib/mappers/public";
import http from ".";

export const eventKeys = {
  public: ["events", "public"] as const,
};

export const useGetPublicEvents = () =>
  useQuery({
    queryKey: eventKeys.public,
    queryFn: async () => {
      const res = await http.get("/event/public");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) => mapPublicEvent(item as Parameters<typeof mapPublicEvent>[0]));
    },
  });
