"use client";

import { Button } from "@heroui/react";
import type { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  stats?: ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  onAction,
  stats,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
        {stats ? <div className="mt-3 flex flex-wrap gap-2">{stats}</div> : null}
      </div>
      {actionLabel && onAction ? (
        <Button
          radius="md"
          startContent={<LuPlus size={18} />}
          onPress={onAction}
          className="bg-primary font-semibold text-white shadow-md transition-all hover:bg-[#040e3d]"
        >
          {actionLabel}
        </Button>
      ) : null}
    </header>
  );
}
