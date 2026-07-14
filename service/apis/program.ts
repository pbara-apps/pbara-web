import { useQuery } from "@tanstack/react-query";
import {
  isRegistrationClosed,
  mapPublicProgram,
} from "@/lib/mappers/public";
import http from ".";

export const programKeys = {
  public: ["programs", "public"] as const,
  publicBySlug: (slug: string) => ["programs", "public", slug] as const,
};

export const useGetPublicPrograms = (options?: { openOnly?: boolean }) =>
  useQuery({
    queryKey: [...programKeys.public, { openOnly: options?.openOnly ?? false }],
    queryFn: async () => {
      const res = await http.get("/program/public");
      const list = ((res.data ?? []) as unknown[]).map((item) =>
        mapPublicProgram(item as Parameters<typeof mapPublicProgram>[0]),
      );
      if (options?.openOnly) {
        return list.filter(
          (program) => !isRegistrationClosed(program.registrationDeadline),
        );
      }
      return list;
    },
  });

export const useGetPublicProgramBySlug = (slug: string) =>
  useQuery({
    queryKey: programKeys.publicBySlug(slug),
    enabled: Boolean(slug),
    retry: false,
    queryFn: async () => {
      const res = await http.get(`/program/public/${slug}`);
      const program = mapPublicProgram(
        res.data as Parameters<typeof mapPublicProgram>[0],
      );
      return {
        program,
        isClosed: isRegistrationClosed(program.registrationDeadline),
      };
    },
  });
