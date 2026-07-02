import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapExecutive } from "@/lib/mappers/admin";
import type { ExecutiveRole } from "@/types/user";
import http from ".";
import { executiveKeys } from "./executive";

export const settingsKeys = {
  executives: ["settings", "executives"] as const,
};

export const useGetExecutivesForSettings = (enabled = true) =>
  useQuery({
    queryKey: settingsKeys.executives,
    queryFn: async () => {
      const res = await http.get("/settings/executives");
      const list = (res.data ?? []) as unknown[];
      return list.map((item) =>
        mapExecutive(item as Parameters<typeof mapExecutive>[0]),
      );
    },
    enabled,
  });

export const useUpdateExecutiveRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      role,
    }: {
      id: string;
      role: ExecutiveRole;
    }) => {
      const res = await http.patch(`/settings/executives/${id}/role`, { role });
      return mapExecutive(res.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.executives });
      qc.invalidateQueries({ queryKey: executiveKeys.all });
    },
  });
};
