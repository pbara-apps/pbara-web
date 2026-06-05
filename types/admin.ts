export type ExecutiveStatus = "active" | "draft" | "inactive";

export interface AdminExecutive {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  chapter: string;
  status: ExecutiveStatus;
  bio?: string;
  image?: string | null;
  visible?: boolean;
}

export const EXECUTIVE_ROLES = [
  "President",
  "Vice President",
  "General Secretary",
  "Asst. General Secretary",
  "Treasurer",
  "Financial Secretary",
  "Director",
  "Asst. Director",
  "Recording Secretary",
  "Mission Officer",
  "Parade Commander",
  "Asst. Parade Commander",
] as const;

export const EXECUTIVE_CHAPTERS = [
  "Lagos Central",
  "Lagos South",
  "Lagos West",
  "Abuja North",
  "Abuja South",
  "Port Harcourt",
  "Ibadan",
  "Ogbomoso",
  "Enugu",
  "Calabar",
] as const;

export const EXECUTIVE_STATUSES: ExecutiveStatus[] = [
  "active",
  "draft",
  "inactive",
];
