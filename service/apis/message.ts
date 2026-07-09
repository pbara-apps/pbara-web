import { useMutation } from "@tanstack/react-query";
import http from ".";

export interface ContactFormPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const useSubmitContactMessage = () =>
  useMutation({
    mutationFn: async (body: ContactFormPayload) => {
      const res = await http.post("/message/public/create", body);
      return res.data;
    },
  });
