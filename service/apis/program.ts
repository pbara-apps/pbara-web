import { useQuery } from "@tanstack/react-query";
import {
  isRegistrationClosed,
  mapPublicProgram,
} from "@/lib/mappers/public";
import http from ".";

export const programKeys = {
  publicBySlug: (slug: string) => ["programs", "public", slug] as const,
};

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
