type RawDirectorDesk = {
  _id?: string;
  name?: string;
  title?: string;
  description?: string;
  image?: string | null;
};

export type PublicDirectorDesk = {
  name: string;
  title: string;
  description: string;
  image?: string | null;
};

const FALLBACK: PublicDirectorDesk = {
  name: "Association Director",
  title: "Director's Desk",
  description:
    "Welcome to the official website of the Pentecost Baptist Association Royal Ambassadors. Our mission is to train boys in faith, discipline, and Christlike character.",
  image: null,
};

export async function fetchPublicDirectorDesk(): Promise<PublicDirectorDesk> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api";
  try {
    const response = await fetch(`${baseUrl}/admin/director-desk/public`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return FALLBACK;

    const payload = (await response.json()) as { data?: RawDirectorDesk | null };
    const data = payload.data;
    if (!data) return FALLBACK;

    return {
      name: data.name?.trim() || FALLBACK.name,
      title: data.title?.trim() || FALLBACK.title,
      description: data.description?.trim() || FALLBACK.description,
      image: data.image ?? null,
    };
  } catch {
    return FALLBACK;
  }
}
