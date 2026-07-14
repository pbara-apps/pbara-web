import {
  isRegistrationClosed,
  mapPublicProgram,
} from "@/lib/mappers/public";
import type { RegistrationProgram } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";

type ApiListResponse = {
  data?: Parameters<typeof mapPublicProgram>[0][];
};

/** Active programs that are still within the registration deadline. */
export async function fetchOpenPublicPrograms(): Promise<RegistrationProgram[]> {
  try {
    const res = await fetch(`${API_URL}/program/public`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as ApiListResponse;
    return (json.data ?? [])
      .map((item) => mapPublicProgram(item))
      .filter((program) => !isRegistrationClosed(program.registrationDeadline));
  } catch {
    return [];
  }
}

export function registrationPath(slug: string) {
  return `/registration/${slug}`;
}
