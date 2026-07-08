"use client";

import {
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { LuCalendar, LuPlus, LuSearch } from "react-icons/lu";
import { AdminContentCard } from "@/components/admin/shared/AdminContentCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BulkActionBar } from "@/components/admin/shared/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import {
  useDeleteEvent,
  useDeleteEventsBulk,
  useGetEvents,
} from "@/service/apis/event";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useDrawer } from "@/store/useDrawer";
import { formatEventDateLabel } from "@/lib/event-date";
import type { EventStatus } from "@/types/admin";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "@/types/admin";
import { canWriteAdminContent } from "@/types/user";

const PAGE_SIZE = 9;

export default function EventAdminPage() {
  const openDrawer = useDrawer((s) => s.openDrawer);
  const { user } = useCurrentUser();
  const canManage = canWriteAdminContent(user?.role);
  const { data: items = [], isLoading, isError, refetch } = useGetEvents();
  const deleteOne = useDeleteEvent();
  const deleteBulk = useDeleteEventsBulk();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<EventStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.venue.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [items, search, category, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const upcomingCount = items.filter((i) => i.status === "open").length;

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.ids.length === 1) await deleteOne.mutateAsync(deleteTarget.ids[0]);
      else await deleteBulk.mutateAsync(deleteTarget.ids);
      successToast("Event deleted.");
      setSelected(new Set());
      setDeleteTarget(null);
    } catch (err) {
      errorToast((err as { message?: string })?.message ?? "Delete failed.", "Error");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Events"
        description="Manage upcoming programmes, ceremonies, and past event archives."
        actionLabel="Create Event"
        onAction={() => openDrawer("create-event")}
        actionDisabled={!canManage}
        actionDisabledText="Your role does not permit event updates."
        stats={
          <>
            <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">{items.length} events</Chip>
            <Chip size="sm" variant="flat" className="bg-emerald-100 text-emerald-700">{upcomingCount} upcoming</Chip>
          </>
        }
      />

      <section className="flex flex-wrap gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3">
        <Input placeholder="Search events…" value={search} onValueChange={(v) => { setSearch(v); setPage(1); }} startContent={<LuSearch size={16} className="text-text-muted" />} variant="flat" radius="full" className="min-w-[240px] flex-1" classNames={{ inputWrapper: "bg-background/60 border border-text-dark/[0.06]", input: "text-sm" }} />
        <Select selectedKeys={[category]} onSelectionChange={(keys) => { setCategory(Array.from(keys)[0] as string); setPage(1); }} className="w-44" variant="flat" radius="md" aria-label="Category">
          <SelectItem key="all">All Categories</SelectItem>
          <>
            {EVENT_CATEGORIES.map((c) => (
              <SelectItem key={c}>{c}</SelectItem>
            ))}
          </>
        </Select>
        <Select selectedKeys={[status]} onSelectionChange={(keys) => { setStatus(Array.from(keys)[0] as EventStatus | "all"); setPage(1); }} className="w-36" variant="flat" radius="md" aria-label="Status">
          <SelectItem key="all">All Status</SelectItem>
          <>
            {EVENT_STATUSES.map((s) => (
              <SelectItem key={s} className="capitalize">{s}</SelectItem>
            ))}
          </>
        </Select>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner color="primary" /></div>
      ) : isError ? (
        <div className="py-20 text-center"><Button onPress={() => refetch()}>Retry</Button></div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-text-dark/10 py-20">
          <LuCalendar size={32} className="text-primary/40" />
          <p className="text-sm text-text-muted">No events scheduled yet.</p>
          <Button startContent={<LuPlus size={16} />} className="bg-primary text-white" onPress={() => openDrawer("create-event")} isDisabled={!canManage}>Create Event</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((item) => (
              <AdminContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={`${formatEventDateLabel(item.date, item.endDate)} · ${item.venue}`}
                image={item.image}
                chips={[
                  { label: item.category },
                  {
                    label: item.status,
                    color: item.status === "open" ? "success" : item.status === "cancelled" ? "danger" : "default",
                  },
                ]}
                selected={selected.has(item.id)}
                onSelect={toggleSelect}
                onEdit={() => openDrawer("edit-event", { body: item })}
                onDelete={() => setDeleteTarget({ ids: [item.id], label: item.title })}
                onClick={() => openDrawer("edit-event", { body: item })}
                fallbackIcon={<LuCalendar size={32} />}
                canManage={canManage}
              />
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Pagination total={pages} page={page} onChange={setPage} size="sm" showControls radius="md" />
          </div>
        </>
      )}

      <BulkActionBar count={selected.size} entityLabel="Event" onClear={() => setSelected(new Set())} onDelete={() => setDeleteTarget({ ids: Array.from(selected), label: `${selected.size} events` })} deleting={deleteBulk.isPending} disabled={!canManage} />
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete event" message={`Remove ${deleteTarget?.label ?? "selected events"}?`} loading={deleteOne.isPending || deleteBulk.isPending} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
