import { Chip } from "@heroui/react";
import type { ExecutiveStatus } from "@/types/admin";

const statusMap: Record<
  ExecutiveStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 ring-emerald-200/60",
  },
  draft: {
    label: "Draft",
    className: "bg-text-dark/[0.06] text-text-muted ring-text-dark/[0.08]",
  },
  inactive: {
    label: "Inactive",
    className: "bg-rose-100 text-rose-700 ring-rose-200/60",
  },
};

export function StatusChip({ status }: { status: ExecutiveStatus }) {
  const s = statusMap[status];
  return (
    <Chip
      size="sm"
      variant="flat"
      classNames={{
        base: `${s.className} ring-1 px-2`,
        content:
          "text-[10px] font-bold uppercase tracking-[0.08em] leading-none",
      }}
    >
      {s.label}
    </Chip>
  );
}
