import { useMutation } from "@tanstack/react-query";
import type { CreateRegistrationPayload } from "@/types";
import http from ".";

export interface ProofUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  format?: string;
  bytes?: number;
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
    mutationFn: async (body: CreateRegistrationPayload) => {
      const res = await http.post("/registration/create", body);
      return res.data;
    },
  });
