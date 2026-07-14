import { eventEndTimestamp } from "@/lib/event-date";
import type {
  Chapter,
  EventItem,
  Executive,
  NewsDetail,
  NewsItem,
  Patron,
  RegistrationProgram,
  RegistrationRank,
} from "@/types";

type PopulatedRef = {
  _id?: string;
  name?: string;
  chapter?: string;
};

type RawExecutive = {
  _id?: string;
  id?: string;
  name: string;
  office?: PopulatedRef;
  church?: PopulatedRef;
  description?: string;
  image?: string | null;
};

type RawChapter = {
  _id?: string;
  id?: string;
  name: string;
  chapter: string;
  counsellor?: string;
  status: "active" | "inactive";
  image?: string | null;
};

type RawPatron = {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  quote: string;
  description?: string | null;
  image?: string | null;
};

type RawNews = {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content?: string;
  image?: string | null;
  author?: string | null;
  read_time?: number;
  createdAt?: string;
};

type RawEvent = {
  _id?: string;
  title: string;
  category: string;
  date: string;
  endDate?: string | null;
  venue: string;
  description: string;
  image?: string | null;
  status: string;
};

type RawGallery = {
  _id?: string;
  title: string;
  alt?: string;
  url: string;
  type: "image" | "video";
  category?: string;
};

function toId(raw: { _id?: string; id?: string }) {
  return raw._id?.toString() ?? raw.id ?? "";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isPastEvent(date: string, status: string, endDate?: string | null) {
  if (status === "completed" || status === "cancelled") return true;
  const endTs = eventEndTimestamp(date, endDate);
  if (endTs == null) return false;
  return endTs < Date.now();
}

export function mapPublicExecutive(raw: RawExecutive): Executive {
  return {
    id: toId(raw),
    name: raw.name,
    position: raw.office?.name ?? "",
    church: raw.church?.name ?? raw.church?.chapter ?? "",
    image: raw.image ?? null,
    bio: raw.description,
  };
}

export function mapPublicChapter(raw: RawChapter): Chapter {
  return {
    id: toId(raw),
    chapterName: raw.chapter,
    churchName: raw.name,
    commander: raw.counsellor ?? "—",
    unit: "general",
    status: raw.status,
    image: raw.image ?? undefined,
  };
}

export function mapPublicPatron(raw: RawPatron): Patron {
  return {
    id: toId(raw),
    name: raw.name,
    role: raw.role,
    quote: raw.quote,
    description: raw.description ?? undefined,
    image: raw.image ?? undefined,
  };
}

export function mapPublicNews(raw: RawNews): NewsItem {
  return {
    id: toId(raw),
    title: raw.title,
    category: raw.category,
    date: formatDate(raw.createdAt),
    excerpt: raw.excerpt,
    image: raw.image ?? undefined,
    readTime: raw.read_time ?? 3,
    author: raw.author ?? undefined,
    slug: raw.slug,
  };
}

export function mapPublicNewsDetail(raw: RawNews): NewsDetail {
  return {
    ...mapPublicNews(raw),
    content: raw.content ?? "",
  };
}

export function mapPublicEvent(raw: RawEvent): EventItem {
  const isPast = isPastEvent(raw.date, raw.status, raw.endDate);
  return {
    id: toId(raw),
    title: raw.title,
    category: raw.category,
    date: raw.date,
    endDate: raw.endDate ?? null,
    venue: raw.venue,
    description: raw.description,
    image: raw.image ?? undefined,
    status: raw.status,
    isPast,
  };
}

export function mapPublicGallery(raw: RawGallery) {
  return {
    id: toId(raw),
    title: raw.title,
    alt: raw.alt ?? raw.title,
    url: raw.url,
    type: raw.type,
    category: raw.category ?? "General",
  };
}

type RawBankDetails = {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
};

type RawProgram = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  description?: string | null;
  flyerImageUrl?: string | null;
  amount: number;
  bankDetails?: RawBankDetails;
  registrationMode: RegistrationProgram["registrationMode"];
  registrationDeadline?: string | Date | null;
  isActive?: boolean;
  termsAndConditions?: string | null;
};

type RawRank = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category?: string;
};

function toIsoString(value?: string | Date | null): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export function mapPublicProgram(raw: RawProgram): RegistrationProgram {
  return {
    id: toId(raw),
    title: raw.title,
    slug: raw.slug,
    category: raw.category,
    description: raw.description ?? null,
    flyerImageUrl: raw.flyerImageUrl ?? null,
    amount: Number(raw.amount ?? 0),
    bankDetails: {
      bankName: raw.bankDetails?.bankName ?? "",
      accountName: raw.bankDetails?.accountName ?? "",
      accountNumber: raw.bankDetails?.accountNumber ?? "",
    },
    registrationMode: raw.registrationMode,
    registrationDeadline: toIsoString(raw.registrationDeadline),
    isActive: raw.isActive !== false,
    termsAndConditions: raw.termsAndConditions ?? null,
  };
}

export function mapPublicRank(raw: RawRank): RegistrationRank {
  return {
    id: toId(raw),
    name: raw.name,
    description: raw.description,
    category: raw.category,
  };
}

/** True when the registration deadline has passed (inclusive of deadline day end). */
export function isRegistrationClosed(
  deadline?: string | null,
  now: Date = new Date(),
): boolean {
  if (!deadline) return false;
  return now.getTime() > new Date(deadline).getTime();
}
