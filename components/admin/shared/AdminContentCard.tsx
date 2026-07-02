"use client";

import {
  Button,
  Checkbox,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@heroui/react";
import Image from "next/image";
import { LuEllipsisVertical, LuPencil, LuTrash2 } from "react-icons/lu";

interface AdminContentCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  chips?: { label: string; color?: "default" | "success" | "warning" | "danger" }[];
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  fallbackIcon?: React.ReactNode;
}

export function AdminContentCard({
  id,
  title,
  subtitle,
  image,
  chips = [],
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onClick,
  fallbackIcon,
}: AdminContentCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)] transition-all duration-200",
        selected
          ? "border-gold ring-2 ring-gold/30"
          : "border-text-dark/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(27,36,82,0.08)]",
      )}
    >
      {onSelect ? (
        <div className="absolute left-3 top-3 z-10">
          <Checkbox
            isSelected={selected}
            onValueChange={(v) => onSelect(id, v)}
            color="warning"
            classNames={{ wrapper: "bg-white/90 backdrop-blur-sm" }}
            aria-label={`Select ${title}`}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClick}
        className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-[#040e3d]/10 text-left"
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40">
            {fallbackIcon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Chip
                key={chip.label}
                size="sm"
                variant="flat"
                color={chip.color ?? "default"}
                className="bg-white/90 text-[10px] font-bold uppercase tracking-wider text-primary"
              >
                {chip.label}
              </Chip>
            ))}
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold text-primary">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                radius="md"
                aria-label="Open actions"
                className="shrink-0 text-text-muted"
              >
                <LuEllipsisVertical size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Card actions"
              onAction={(key) => {
                if (key === "edit") onEdit?.();
                if (key === "delete") onDelete?.();
              }}
            >
              <DropdownItem key="edit" startContent={<LuPencil size={14} />}>
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-rose-600"
                color="danger"
                startContent={<LuTrash2 size={14} />}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </article>
  );
}
