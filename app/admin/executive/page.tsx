"use client";

import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMemo, useState } from "react";
import {
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";
import { StatusChip } from "@/components/admin/executives/StatusChip";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BulkActionBar } from "@/components/admin/shared/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useGetChapters } from "@/service/apis/church";
import {
  useDeleteExecutive,
  useDeleteExecutivesBulk,
  useGetExecutives,
} from "@/service/apis/executive";
import { useGetOffices } from "@/service/apis/office";
import { useDrawer } from "@/store/useDrawer";
import type { AdminExecutive, ExecutiveStatus } from "@/types/admin";
import { EXECUTIVE_STATUSES } from "@/types/admin";

type ColumnKey = "executive" | "role" | "chapter" | "status" | "actions";

const columns: { key: ColumnKey; label: string; align?: "center" | "end" }[] = [
  { key: "executive", label: "EXECUTIVE" },
  { key: "role", label: "OFFICE" },
  { key: "chapter", label: "CHAPTER" },
  { key: "status", label: "STATUS", align: "center" },
  { key: "actions", label: "ACTIONS", align: "end" },
];

const PAGE_SIZE = 8;

export default function ExecutiveAdminPage() {
  const openDrawer = useDrawer((s) => s.openDrawer);
  const { data: executives = [], isLoading, isError, refetch } = useGetExecutives();
  const { data: offices = [] } = useGetOffices();
  const { data: chapters = [] } = useGetChapters();
  const deleteExecutive = useDeleteExecutive();
  const deleteBulk = useDeleteExecutivesBulk();

  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState<string>("all");
  const [chapterFilter, setChapterFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ExecutiveStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{
    ids: string[];
    label: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return executives.filter((e) => {
      if (officeFilter !== "all" && e.officeId !== officeFilter) return false;
      if (chapterFilter !== "all" && e.churchId !== chapterFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.officeName.toLowerCase().includes(q) ||
        e.chapterName.toLowerCase().includes(q) ||
        e.churchName.toLowerCase().includes(q)
      );
    });
  }, [executives, search, officeFilter, chapterFilter, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const activeCount = executives.filter((e) => e.status === "active").length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.ids.length === 1) {
        await deleteExecutive.mutateAsync(deleteTarget.ids[0]);
      } else {
        await deleteBulk.mutateAsync(deleteTarget.ids);
      }
      successToast(
        deleteTarget.ids.length === 1
          ? "Executive deleted."
          : `${deleteTarget.ids.length} executives deleted.`,
      );
      setSelectedKeys(new Set());
      setDeleteTarget(null);
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ?? "Delete failed.",
        "Error",
      );
    }
  };

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
                {exec.email || exec.phone}
              </p>
            </div>
          </div>
        );
      case "role":
        return (
          <span className="text-sm font-medium text-text-dark">
            {exec.officeName || "—"}
          </span>
        );
      case "chapter":
        return (
          <div className="min-w-0">
            <p className="truncate text-sm text-text-dark">{exec.chapterName}</p>
            <p className="truncate text-[11px] text-text-muted">
              {exec.churchName}
            </p>
          </div>
        );
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
                  if (key === "edit") openDrawer("edit-executive", { body: exec });
                  if (key === "delete") {
                    setDeleteTarget({ ids: [exec.id], label: exec.name });
                  }
                }}
              >
                <DropdownItem key="edit" startContent={<LuPencil size={14} />}>
                  Edit profile
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
      <AdminPageHeader
        title="Executive Leadership"
        description="Manage association executives, office assignments, and public visibility."
        actionLabel="Add Executive"
        onAction={() => openDrawer("create-executive")}
        stats={
          <>
            <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
              {executives.length} total
            </Chip>
            <Chip size="sm" variant="flat" className="bg-emerald-100 text-emerald-700">
              {activeCount} active
            </Chip>
          </>
        }
      />

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3 shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        <div className="min-w-[240px] flex-1">
          <Input
            placeholder="Search by name, email, office, chapter…"
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
          aria-label="Filter by office"
          selectedKeys={[officeFilter]}
          onSelectionChange={(keys) => {
            setOfficeFilter((Array.from(keys)[0] as string) ?? "all");
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-44"
          classNames={selectTriggerCx}
        >
          <SelectItem key="all">All Offices</SelectItem>
          <>
            {offices.map((o) => (
              <SelectItem key={o.id}>{o.name}</SelectItem>
            ))}
          </>
        </Select>

        <Select
          aria-label="Filter by chapter"
          selectedKeys={[chapterFilter]}
          onSelectionChange={(keys) => {
            setChapterFilter((Array.from(keys)[0] as string) ?? "all");
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-48"
          classNames={selectTriggerCx}
        >
          <SelectItem key="all">All Chapters</SelectItem>
          <>
            {chapters.map((c) => (
              <SelectItem key={c.id}>
                {c.chapter} · {c.name}
              </SelectItem>
            ))}
          </>
        </Select>

        <Select
          aria-label="Filter by status"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => {
            setStatusFilter((Array.from(keys)[0] as ExecutiveStatus | "all") ?? "all");
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-36"
          classNames={selectTriggerCx}
        >
          <SelectItem key="all">All Status</SelectItem>
          <>
            {EXECUTIVE_STATUSES.map((s) => (
              <SelectItem key={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </>
        </Select>
      </section>

      <section className="overflow-hidden rounded-2xl border border-text-dark/[0.05] bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Spinner color="primary" />
            <p className="text-sm text-text-muted">Loading executives…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-sm text-rose-600">Unable to load executives.</p>
            <Button size="sm" onPress={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
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
                if (exec) openDrawer("edit-executive", { body: exec });
              }}
              classNames={tableCx}
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
                        No executives found
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        Add your first executive or adjust filters.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      startContent={<LuPlus size={14} />}
                      onPress={() => openDrawer("create-executive")}
                      className="bg-primary text-white"
                    >
                      Add Executive
                    </Button>
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
                <span className="font-semibold text-text-dark">
                  {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                </span>
                –
                <span className="font-semibold text-text-dark">
                  {Math.min(page * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
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
          </>
        )}
      </section>

      <BulkActionBar
        count={selectedKeys.size}
        entityLabel="Executive"
        onClear={() => setSelectedKeys(new Set())}
        onDelete={() =>
          setDeleteTarget({
            ids: Array.from(selectedKeys),
            label: `${selectedKeys.size} selected executives`,
          })
        }
        deleting={deleteBulk.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete executive"
        message={`This will permanently remove ${deleteTarget?.label ?? "the selected record(s)"}. This action cannot be undone.`}
        loading={deleteExecutive.isPending || deleteBulk.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

const selectTriggerCx = {
  trigger:
    "bg-background/60 shadow-none data-[hover=true]:bg-background border border-text-dark/[0.06] data-[focus=true]:border-gold/50 data-[open=true]:border-gold/50",
  value: "text-sm",
};

const tableCx = {
  th: "bg-background/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted py-3",
  tr: "data-[hover=true]:bg-background/60 cursor-pointer",
  td: "py-3 align-middle text-sm",
};
