import { useMutation } from "@tanstack/react-query";
import http from ".";

export interface SubscribePayload {
  email: string;
  source?: string;
}

export const useSubscribeNewsletter = () =>
  useMutation({
    mutationFn: async (body: SubscribePayload) => {
      // http interceptor already unwraps response.data
      return (await http.post("/subscriber/public/subscribe", body)) as unknown as {
        message: string;
      };
    },
  });
