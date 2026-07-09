import { useQuery } from "@tanstack/react-query";
import { mapPublicGallery } from "@/lib/mappers/public";
import http from ".";

export const galleryKeys = {
  public: (type?: "photo" | "video") => ["gallery", "public", type ?? "all"] as const,
};

export const useGetPublicGallery = (type?: "photo" | "video") =>
  useQuery({
    queryKey: galleryKeys.public(type),
    queryFn: async () => {
      const res = await http.get("/gallery/public", {
        params: type ? { type } : undefined,
      });
      const list = (res.data ?? []) as unknown[];
      return list.map((item) =>
        mapPublicGallery(item as Parameters<typeof mapPublicGallery>[0]),
      );
    },
  });
