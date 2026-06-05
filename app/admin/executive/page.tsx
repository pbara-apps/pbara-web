"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from "@heroui/react";
import { useMemo, useState } from "react";
import {
  LuEye,
  LuEyeOff,
  LuMoveDown,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSlidersHorizontal,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";
import { StatusChip } from "@/components/admin/executives/StatusChip";
import { adminExecutives } from "@/data/admin/executives";
import { useDrawer } from "@/store/useDrawer";
import {
  EXECUTIVE_CHAPTERS,
  EXECUTIVE_ROLES,
  type AdminExecutive,
  type ExecutiveStatus,
} from "@/types/admin";

type ColumnKey = "executive" | "role" | "chapter" | "status" | "actions";

const columns: { key: ColumnKey; label: string; align?: "center" | "end" }[] = [
  { key: "executive", label: "EXECUTIVE" },
  { key: "role", label: "ROLE" },
  { key: "chapter", label: "CHAPTER" },
  { key: "status", label: "STATUS", align: "center" },
  { key: "actions", label: "ACTIONS", align: "end" },
];

const PAGE_SIZE = 8;

export default function ExecutiveAdminPage() {
  const openDrawer = useDrawer((s) => s.openDrawer);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [chapterFilter, setChapterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ExecutiveStatus | "all">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return adminExecutives.filter((e) => {
      if (roleFilter !== "all" && e.role !== roleFilter) return false;
      if (chapterFilter !== "all" && e.chapter !== chapterFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.chapter.toLowerCase().includes(q)
      );
    });
  }, [search, roleFilter, chapterFilter, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const selectedCount = selectedKeys.size;
  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, filtered.length);

  const renderCell = (exec: AdminExecutive, key: ColumnKey) => {
    switch (key) {
      case "executive":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={exec.image ?? undefined}
              name={exec.name}
              size="sm"
              classNames={{
                base: "bg-gradient-to-br from-primary to-[#040e3d] text-white text-[11px] font-bold ring-1 ring-text-dark/[0.06]",
              }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">
                {exec.name}
              </p>
              <p className="truncate text-[11px] text-text-muted">
                {exec.email}
              </p>
            </div>
          </div>
        );
      case "role":
        return (
          <span className="text-sm font-medium text-text-dark">
            {exec.role}
          </span>
        );
      case "chapter":
        return <span className="text-sm text-text-muted">{exec.chapter}</span>;
      case "status":
        return (
          <div className="flex justify-center">
            <StatusChip status={exec.status} />
          </div>
        );
      case "actions":
        return (
          <div className="flex justify-end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  radius="md"
                  aria-label="Open actions"
                  className="text-text-muted"
                >
                  ⋮
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Executive actions"
                onAction={(key) => {
                  if (key === "edit") {
                    openDrawer("edit-executive", exec);
                  }
                }}
              >
                <DropdownItem key="edit" startContent={<LuPencil size={14} />}>
                  Edit profile
                </DropdownItem>
                <DropdownItem
                  key="visibility"
                  startContent={
                    exec.visible ? <LuEyeOff size={14} /> : <LuEye size={14} />
                  }
                >
                  {exec.visible ? "Hide from public" : "Show on public site"}
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
        );
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Executive Leadership
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage association executives, their roles, and public visibility.
          </p>
        </div>
        <Button
          radius="md"
          startContent={<LuPlus size={18} />}
          onPress={() => openDrawer("create-executive")}
          className="bg-primary font-semibold text-white shadow-md transition-all hover:bg-[#040e3d]"
        >
          Add New Executive
        </Button>
      </header>

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3 shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        <div className="min-w-[240px] flex-1">
          <Input
            placeholder="Search by name, email, role…"
            value={search}
            onValueChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            startContent={<LuSearch size={16} className="text-text-muted" />}
            variant="flat"
            radius="full"
            classNames={{
              inputWrapper:
                "bg-background/60 shadow-none data-[hover=true]:bg-background data-[focus=true]:bg-surface border border-text-dark/[0.06] data-[focus=true]:border-gold/50",
              input: "text-sm",
            }}
          />
        </div>

        <Select
          aria-label="Filter by role"
          selectedKeys={[roleFilter]}
          onSelectionChange={(keys) => {
            const v = (Array.from(keys)[0] as string) ?? "all";
            setRoleFilter(v);
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-44"
          classNames={{
            trigger:
              "bg-background/60 shadow-none data-[hover=true]:bg-background border border-text-dark/[0.06] data-[focus=true]:border-gold/50 data-[open=true]:border-gold/50",
            value: "text-sm",
          }}
        >
          <SelectItem key="all">All Roles</SelectItem>
          <>
            {EXECUTIVE_ROLES.map((r) => (
              <SelectItem key={r}>{r}</SelectItem>
            ))}
          </>
        </Select>

        <Select
          aria-label="Filter by chapter"
          selectedKeys={[chapterFilter]}
          onSelectionChange={(keys) => {
            const v = (Array.from(keys)[0] as string) ?? "all";
            setChapterFilter(v);
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-48"
          classNames={{
            trigger:
              "bg-background/60 shadow-none data-[hover=true]:bg-background border border-text-dark/[0.06] data-[focus=true]:border-gold/50 data-[open=true]:border-gold/50",
            value: "text-sm",
          }}
        >
          <SelectItem key="all">All Chapters</SelectItem>
          <>
            {EXECUTIVE_CHAPTERS.map((c) => (
              <SelectItem key={c}>{c}</SelectItem>
            ))}
          </>
        </Select>

        <Select
          aria-label="Filter by status"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => {
            const v = (Array.from(keys)[0] as string) ?? "all";
            setStatusFilter(v as ExecutiveStatus | "all");
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-36"
          classNames={{
            trigger:
              "bg-background/60 shadow-none data-[hover=true]:bg-background border border-text-dark/[0.06] data-[focus=true]:border-gold/50 data-[open=true]:border-gold/50",
            value: "text-sm",
          }}
        >
          <SelectItem key="all">All Status</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="draft">Draft</SelectItem>
          <SelectItem key="inactive">Inactive</SelectItem>
        </Select>

        <Button
          variant="light"
          radius="md"
          startContent={<LuSlidersHorizontal size={16} />}
          className="text-text-muted hover:text-primary"
        >
          More
        </Button>
      </section>

      <section className="overflow-hidden rounded-2xl border border-text-dark/[0.05] bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        <Table
          aria-label="Executive leadership"
          removeWrapper
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys === "all") {
              setSelectedKeys(new Set(filtered.map((e) => e.id)));
            } else {
              setSelectedKeys(new Set(Array.from(keys as Set<string>)));
            }
          }}
          onRowAction={(key) => {
            const exec = filtered.find((e) => e.id === key);
            if (exec) openDrawer("edit-executive", exec);
          }}
          classNames={{
            th: "bgbackground/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted py-3",
            tr: "data-[hover=true]:bg-background/60 cursor-pointer",
            td: "py-3 align-middle text-sm",
          }}
        >
          <TableHeader columns={columns}>
            {(col) => (
              <TableColumn key={col.key} align={col.align ?? "start"}>
                {col.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={pageItems}
            emptyContent={
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/[0.06] text-primary">
                  <LuUsers size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-dark">
                    No executives match your filters
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Try clearing the search or filter selections.
                  </p>
                </div>
              </div>
            }
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey as ColumnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-text-dark/[0.05] bg-background/40 px-5 py-3 sm:flex-row">
          <p className="text-xs text-text-muted">
            Showing{" "}
            <span className="font-semibold text-text-dark">{showingFrom}</span>–
            <span className="font-semibold text-text-dark">{showingTo}</span> of{" "}
            <span className="font-semibold text-text-dark">
              {filtered.length}
            </span>{" "}
            executives
          </p>
          <Pagination
            total={pages}
            page={page}
            onChange={setPage}
            size="sm"
            showControls
            radius="md"
            classNames={{
              item: "bg-transparent text-text-muted data-[hover=true]:bg-text-dark/5",
              cursor: "bg-primary text-white font-semibold",
            }}
          />
        </div>
      </section>

      <BulkActionBar
        count={selectedCount}
        onClear={() => setSelectedKeys(new Set())}
      />
    </div>
  );
}

function BulkActionBar({
  count,
  onClear,
}: {
  count: number;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 transition-all duration-300 ease-out",
        count > 0
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "translate-y-3 opacity-0",
      )}
      role="region"
      aria-label="Bulk actions"
      aria-hidden={count === 0}
    >
      <div className="flex items-center gap-5 rounded-full bg-primary px-5 py-2.5 text-sm text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-primary">
            {count}
          </span>
          <span className="font-semibold">
            {count === 1 ? "Executive" : "Executives"} selected
          </span>
        </div>
        <span className="h-5 w-px bg-white/15" aria-hidden />
        <div className="flex items-center gap-3">
          <BulkBtn icon={<LuEyeOff size={14} />} label="Hide" />
          <BulkBtn icon={<LuMoveDown size={14} />} label="Move" />
          <BulkBtn icon={<LuTrash2 size={14} />} label="Delete" tone="danger" />
        </div>
        <span className="h-5 w-px bg-white/15" aria-hidden />
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-white/70 transition-colors hover:text-white"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function BulkBtn({
  icon,
  label,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold transition-colors",
        tone === "danger"
          ? "text-rose-200 hover:text-white"
          : "text-white/80 hover:text-gold",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
