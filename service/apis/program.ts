import { useQuery } from "@tanstack/react-query";
import { isRegistrationClosed, mapPublicProgram } from "@/lib/mappers/public";
import http from ".";

export const programKeys = {
  public: ["programs", "public"] as const,
  publicBySlug: (slug: string) => ["programs", "public", slug] as const,
};

export type ProgramFetchErrorKind = "not_found" | "server";

export class ProgramFetchError extends Error {
  kind: ProgramFetchErrorKind;

  constructor(kind: ProgramFetchErrorKind, message: string) {
    super(message);
    this.name = "ProgramFetchError";
    this.kind = kind;
  }
}

export function getProgramFetchErrorKind(
  error: unknown,
): ProgramFetchErrorKind {
  if (error instanceof ProgramFetchError) return error.kind;

  const err = error as {
    message?: string;
    code?: string;
    statusCode?: number;
  };
  const message = (err?.message ?? "").toLowerCase();

  if (
    err?.statusCode === 404 ||
    message.includes("not found") ||
    message.includes("program not found")
  ) {
    return "not_found";
  }

  return "server";
}

function toProgramFetchError(error: unknown): ProgramFetchError {
  if (error instanceof ProgramFetchError) return error;

  const err = error as { message?: string; statusCode?: number };
  const kind = getProgramFetchErrorKind(error);
  const message =
    kind === "not_found"
      ? (err?.message ?? "Program not found")
      : (err?.message ??
        "An unexpected error occurred, please try again later. If the problem persists, please contact our support team.");

  return new ProgramFetchError(kind, message);
}

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
    // Render free-tier cold starts can take 30–60s; retry instead of failing fast.
    retry: (failureCount, error) => {
      if (getProgramFetchErrorKind(error) === "not_found") return false;
      return failureCount < 4;
    },
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 15000),
    queryFn: async () => {
      try {
        const res = await http.get(`/program/public/${slug}`, {
          timeout: 60000,
        });
        const program = mapPublicProgram(
          res.data as Parameters<typeof mapPublicProgram>[0],
        );
        return {
          program,
          isClosed: isRegistrationClosed(program.registrationDeadline),
        };
      } catch (error) {
        throw toProgramFetchError(error);
      }
    },
  });
