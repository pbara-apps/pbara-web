import type { IconType } from "react-icons";
import { LuArrowDownRight, LuArrowUpRight, LuMinus } from "react-icons/lu";
import { cn } from "@heroui/react";

export type KpiTrend = "up" | "down" | "flat" | "alert";

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  trend?: KpiTrend;
  trendValue?: string;
}

const trendStyles: Record<
  KpiTrend,
  { wrap: string; icon: IconType; iconClass?: string }
> = {
  up: {
    wrap: "bg-emerald-50 text-emerald-700",
    icon: LuArrowUpRight,
  },
  down: {
    wrap: "bg-rose-50 text-rose-700",
    icon: LuArrowDownRight,
  },
  flat: {
    wrap: "bg-text-dark/[0.05] text-text-muted",
    icon: LuMinus,
  },
  alert: {
    wrap: "bg-gold/10 text-gold",
    icon: LuArrowUpRight,
  },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend = "flat",
  trendValue,
}: KpiCardProps) {
  const t = trendStyles[trend];
  const TrendIcon = t.icon;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-text-dark/[0.05] bg-surface p-5 shadow-[0_1px_2px_rgba(27,36,82,0.04),0_4px_12px_rgba(27,36,82,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(27,36,82,0.06),0_8px_24px_rgba(27,36,82,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.06] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon size={20} />
        </div>
        {trendValue && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
              t.wrap,
            )}
          >
            <TrendIcon size={12} />
            {trendValue}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
          {label}
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}
