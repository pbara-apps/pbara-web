import { useMutation } from "@tanstack/react-query";
import http from ".";

interface LoginTypes {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (body: LoginTypes) => {
      const res = await http.post("auth/login", body);
      return res.data as { user: unknown; token: string };
    },
  });
};
