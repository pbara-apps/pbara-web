"use client";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
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
  LuBriefcase,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from "react-icons/lu";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BulkActionBar } from "@/components/admin/shared/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import {
  useDeleteOffice,
  useDeleteOfficesBulk,
  useGetOffices,
} from "@/service/apis/office";
import { useDrawer } from "@/store/useDrawer";
import type { AdminOffice } from "@/types/admin";

type ColumnKey = "name" | "description" | "actions";

const columns: { key: ColumnKey; label: string; align?: "end" }[] = [
  { key: "name", label: "OFFICE / POSITION" },
  { key: "description", label: "DESCRIPTION" },
  { key: "actions", label: "ACTIONS", align: "end" },
];

const PAGE_SIZE = 10;

export default function OfficeAdminPage() {
  const openDrawer = useDrawer((s) => s.openDrawer);
  const { data: offices = [], isLoading, isError, refetch } = useGetOffices();
  const deleteOffice = useDeleteOffice();
  const deleteBulk = useDeleteOfficesBulk();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{
    ids: string[];
    label: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return offices;
    return offices.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q),
    );
  }, [offices, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.ids.length === 1) {
        await deleteOffice.mutateAsync(deleteTarget.ids[0]);
      } else {
        await deleteBulk.mutateAsync(deleteTarget.ids);
      }
      successToast(
        deleteTarget.ids.length === 1
          ? "Office deleted."
          : `${deleteTarget.ids.length} offices deleted.`,
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

  const renderCell = (office: AdminOffice, key: ColumnKey) => {
    switch (key) {
      case "name":
        return (
          <div>
            <p className="text-sm font-semibold text-primary">{office.name}</p>
          </div>
        );
      case "description":
        return (
          <p className="line-clamp-2 max-w-xl text-sm text-text-muted">
            {office.description}
          </p>
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
                aria-label="Office actions"
                onAction={(key) => {
                  if (key === "edit") openDrawer("edit-office", { body: office });
                  if (key === "delete") {
                    setDeleteTarget({ ids: [office.id], label: office.name });
                  }
                }}
              >
                <DropdownItem key="edit" startContent={<LuPencil size={14} />}>
                  Edit office
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
        title="Offices & Positions"
        description="Define executive roles used when assigning officers across chapters."
        actionLabel="Add Office"
        onAction={() => openDrawer("create-office")}
        stats={
          <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
            {offices.length} offices registered
          </Chip>
        }
      />

      <section className="rounded-xl border border-text-dark/[0.05] bg-surface p-3 shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        <Input
          placeholder="Search offices…"
          value={search}
          onValueChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          startContent={<LuSearch size={16} className="text-text-muted" />}
          variant="flat"
          radius="full"
          className="max-w-md"
          classNames={{
            inputWrapper:
              "bg-background/60 shadow-none border border-text-dark/[0.06] data-[focus=true]:border-gold/50",
            input: "text-sm",
          }}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-text-dark/[0.05] bg-surface shadow-[0_1px_2px_rgba(27,36,82,0.04)]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Spinner color="primary" />
            <p className="text-sm text-text-muted">Loading offices…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-sm text-rose-600">Unable to load offices.</p>
            <Button size="sm" onPress={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table
              aria-label="Offices"
              removeWrapper
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedKeys(new Set(filtered.map((o) => o.id)));
                } else {
                  setSelectedKeys(new Set(Array.from(keys as Set<string>)));
                }
              }}
              onRowAction={(key) => {
                const office = filtered.find((o) => o.id === key);
                if (office) openDrawer("edit-office", { body: office });
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
                      <LuBriefcase size={20} />
                    </div>
                    <p className="text-sm font-semibold text-text-dark">
                      No offices defined yet
                    </p>
                    <Button
                      size="sm"
                      startContent={<LuPlus size={14} />}
                      onPress={() => openDrawer("create-office")}
                      className="bg-primary text-white"
                    >
                      Add Office
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
                {filtered.length} office{filtered.length === 1 ? "" : "s"}
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
        entityLabel="Office"
        onClear={() => setSelectedKeys(new Set())}
        onDelete={() =>
          setDeleteTarget({
            ids: Array.from(selectedKeys),
            label: `${selectedKeys.size} selected offices`,
          })
        }
        deleting={deleteBulk.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete office"
        message={`Remove ${deleteTarget?.label ?? "selected office(s)"}? Executives assigned to these offices may need reassignment.`}
        loading={deleteOffice.isPending || deleteBulk.isPending}
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
