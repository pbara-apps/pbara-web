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
  LuBuilding2,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from "react-icons/lu";
import { ChapterStatusChip } from "@/components/admin/executives/StatusChip";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BulkActionBar } from "@/components/admin/shared/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import {
  useDeleteChapter,
  useDeleteChaptersBulk,
  useGetChapters,
} from "@/service/apis/church";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useDrawer } from "@/store/useDrawer";
import type { AdminChapter, ChapterStatus } from "@/types/admin";
import { CHAPTER_STATUSES } from "@/types/admin";
import { canWriteAdminContent } from "@/types/user";

type ColumnKey = "chapter" | "commander" | "address" | "status" | "actions";

const columns: { key: ColumnKey; label: string; align?: "center" | "end" }[] = [
  { key: "chapter", label: "CHAPTER / CHURCH" },
  { key: "commander", label: "COMMANDER" },
  { key: "address", label: "ADDRESS" },
  { key: "status", label: "STATUS", align: "center" },
  { key: "actions", label: "ACTIONS", align: "end" },
];

const PAGE_SIZE = 10;

export default function ChapterAdminPage() {
  const openDrawer = useDrawer((s) => s.openDrawer);
  const { user } = useCurrentUser();
  const canManage = canWriteAdminContent(user?.role);
  const { data: chapters = [], isLoading, isError, refetch } = useGetChapters();
  const deleteChapter = useDeleteChapter();
  const deleteBulk = useDeleteChaptersBulk();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ChapterStatus | "all">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{
    ids: string[];
    label: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return chapters.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.chapter.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.counsellor ?? "").toLowerCase().includes(q) ||
        (c.address ?? "").toLowerCase().includes(q)
      );
    });
  }, [chapters, search, statusFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = chapters.filter((c) => c.status === "active").length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.ids.length === 1) {
        await deleteChapter.mutateAsync(deleteTarget.ids[0]);
      } else {
        await deleteBulk.mutateAsync(deleteTarget.ids);
      }
      successToast(
        deleteTarget.ids.length === 1
          ? "Chapter deleted."
          : `${deleteTarget.ids.length} chapters deleted.`,
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

  const renderCell = (chapter: AdminChapter, key: ColumnKey) => {
    switch (key) {
      case "chapter":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={chapter.image ?? undefined}
              name={chapter.chapter}
              size="md"
              classNames={{
                base: "bg-gradient-to-br from-primary to-[#040e3d] text-white ring-1 ring-text-dark/[0.06]",
              }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">
                {chapter.chapter}
              </p>
              <p className="truncate text-[11px] text-text-muted">
                {chapter.name}
              </p>
            </div>
          </div>
        );
      case "commander":
        return (
          <span className="text-sm text-text-dark">
            {chapter.counsellor || "—"}
          </span>
        );
      case "address":
        return (
          <span className="line-clamp-2 max-w-xs text-sm text-text-muted">
            {chapter.address || "—"}
          </span>
        );
      case "status":
        return (
          <div className="flex justify-center">
            <ChapterStatusChip status={chapter.status} />
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
                aria-label="Chapter actions"
                disabledKeys={!canManage ? ["edit", "delete"] : []}
                onAction={(key) => {
                  if (key === "edit" && canManage) {
                    openDrawer("edit-church", { body: chapter });
                  }
                  if (key === "delete") {
                    if (!canManage) return;
                    setDeleteTarget({
                      ids: [chapter.id],
                      label: chapter.chapter,
                    });
                  }
                }}
              >
                <DropdownItem key="edit" startContent={<LuPencil size={14} />}>
                  Edit chapter
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
        title="Chapters & Units"
        description="Manage local RA chapters displayed on the public chapters page."
        actionLabel="Register Chapter"
        onAction={() => openDrawer("create-church")}
        actionDisabled={!canManage}
        actionDisabledText="Your role does not permit chapter updates."
        stats={
          <>
            <Chip
              size="sm"
              variant="flat"
              className="bg-primary/10 text-primary"
            >
              {chapters.length} chapters
            </Chip>
            <Chip
              size="sm"
              variant="flat"
              className="bg-emerald-100 text-emerald-700"
            >
              {activeCount} active
            </Chip>
          </>
        }
      />

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3 shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        <div className="min-w-[240px] flex-1">
          <Input
            placeholder="Search chapter, church, commander…"
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
                "bg-background/60 shadow-none border border-text-dark/[0.06] data-[focus=true]:border-gold/50",
              input: "text-sm",
            }}
          />
        </div>
        <Select
          aria-label="Filter by status"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => {
            setStatusFilter(
              (Array.from(keys)[0] as ChapterStatus | "all") ?? "all",
            );
            setPage(1);
          }}
          radius="md"
          variant="flat"
          className="w-36"
          classNames={{
            trigger:
              "bg-background/60 shadow-none border border-text-dark/[0.06] data-[focus=true]:border-gold/50",
            value: "text-sm",
          }}
        >
          <SelectItem key="all">All Status</SelectItem>
          <>
            {CHAPTER_STATUSES.map((s) => (
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
            <p className="text-sm text-text-muted">Loading chapters…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-sm text-rose-600">Unable to load chapters.</p>
            <Button size="sm" onPress={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table
              aria-label="Chapters"
              removeWrapper
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedKeys(new Set(filtered.map((c) => c.id)));
                } else {
                  setSelectedKeys(new Set(Array.from(keys as Set<string>)));
                }
              }}
              onRowAction={(key) => {
                if (!canManage) return;
                const chapter = filtered.find((c) => c.id === key);
                if (chapter) openDrawer("edit-church", { body: chapter });
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
                      <LuBuilding2 size={20} />
                    </div>
                    <p className="text-sm font-semibold text-text-dark">
                      No chapters registered
                    </p>
                    <Button
                      size="sm"
                      startContent={<LuPlus size={14} />}
                      onPress={() => openDrawer("create-church")}
                      isDisabled={!canManage}
                      className="bg-primary text-white"
                    >
                      Register Chapter
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
                {filtered.length} chapter{filtered.length === 1 ? "" : "s"}
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
        entityLabel="Chapter"
        onClear={() => setSelectedKeys(new Set())}
        onDelete={() =>
          setDeleteTarget({
            ids: Array.from(selectedKeys),
            label: `${selectedKeys.size} selected chapters`,
          })
        }
        deleting={deleteBulk.isPending}
        disabled={!canManage}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete chapter"
        message={`Remove ${deleteTarget?.label ?? "selected chapter(s)"}? This will affect executives linked to these chapters.`}
        loading={deleteChapter.isPending || deleteBulk.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

const tableCx = {
  th: "bg-background/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted py-3",
  tr: "data-[hover=true]:bg-background/60 cursor-pointer",
  td: "py-3 align-middle text-sm",
};
