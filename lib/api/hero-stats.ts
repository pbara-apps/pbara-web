import type { HeroStat } from "@/types";

type ApiListResponse<T> = {
  data?: T[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";

const FALLBACK: HeroStat[] = [
  { end: 21, label: "Active Chapters", suffix: "+" },
  { end: 500, label: "Total Ambassadors", suffix: "+" },
  { end: 14, label: "Years of Impact", suffix: "+" },
];

export async function fetchPublicHeroStats(): Promise<HeroStat[]> {
  try {
    const res = await fetch(`${API_URL}/admin/hero-stats/public`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return FALLBACK;

    const json = (await res.json()) as ApiListResponse<Partial<HeroStat>>;
    const stats = (json.data ?? [])
      .map((item) => ({
        end: Number(item.end ?? 0),
        label: String(item.label ?? "").trim(),
        suffix: String(item.suffix ?? "+").trim() || "+",
      }))
      .filter((item) => item.label.length > 0);

    return stats.length > 0 ? stats : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
