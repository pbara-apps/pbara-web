import { useMutation } from "@tanstack/react-query";
import type {
  CreateRegistrationPayload,
  CreatedRegistration,
  CreatedRegistrationParticipant,
} from "@/types";
import http from ".";

export interface ProofUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes?: number;
}

type RawCreatedEntry = {
  name: string;
  registrationCode?: string;
  rank?: { name?: string } | string;
  church?: { name?: string; chapter?: string } | string;
};

type RawCreatedRegistration = {
  _id?: string;
  id?: string;
  registrantName: string;
  registrantPhone: string;
  registrationType: CreatedRegistration["registrationType"];
  status: CreatedRegistration["status"];
  createdAt?: string;
  programId?:
    | {
        title?: string;
      }
    | string;
  entries?: RawCreatedEntry[];
};

function mapCreatedParticipant(
  entry: RawCreatedEntry,
): CreatedRegistrationParticipant {
  const rank =
    typeof entry.rank === "object" && entry.rank !== null ? entry.rank : null;
  const church =
    typeof entry.church === "object" && entry.church !== null
      ? entry.church
      : null;

  return {
    name: entry.name,
    registrationCode: entry.registrationCode ?? "—",
    rankName: rank?.name ?? "—",
    churchName: church?.name ?? "—",
    churchChapter: church?.chapter,
  };
}

function mapCreatedRegistration(
  raw: RawCreatedRegistration,
): CreatedRegistration {
  const programTitle =
    typeof raw.programId === "object" && raw.programId !== null
      ? (raw.programId.title ?? "Program")
      : "Program";

  return {
    id: String(raw._id ?? raw.id ?? ""),
    programTitle,
    registrantName: raw.registrantName,
    registrantPhone: raw.registrantPhone,
    registrationType: raw.registrationType,
    status: raw.status,
    participants: (raw.entries ?? []).map(mapCreatedParticipant),
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
  };
}

export const useUploadRegistrationProof = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await http.post("/registration/upload-proof", formData);
      return res.data as ProofUploadResult;
    },
  });

export const useCreateRegistration = () =>
  useMutation({
    mutationFn: async (
      body: CreateRegistrationPayload,
    ): Promise<CreatedRegistration> => {
      const res = await http.post("/registration/create", body);
      return mapCreatedRegistration(res.data as RawCreatedRegistration);
    },
  });
