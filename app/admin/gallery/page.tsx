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
import { LuImage, LuPlus, LuSearch, LuVideo } from "react-icons/lu";
import { AdminContentCard } from "@/components/admin/shared/AdminContentCard";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { BulkActionBar } from "@/components/admin/shared/BulkActionBar";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import {
  useDeleteGalleryBulk,
  useDeleteGalleryItem,
  useGetGallery,
} from "@/service/apis/gallery";
import { useDrawer } from "@/store/useDrawer";
import type { GalleryStatus, GalleryType } from "@/types/admin";
import { GALLERY_STATUSES, GALLERY_TYPES } from "@/types/admin";

const PAGE_SIZE = 9;

export default function GalleryAdminPage() {
  const openDrawer = useDrawer((s) => s.openDrawer);
  const { data: items = [], isLoading, isError, refetch } = useGetGallery();
  const deleteOne = useDeleteGalleryItem();
  const deleteBulk = useDeleteGalleryBulk();

  const [search, setSearch] = useState("");
  const [type, setType] = useState<GalleryType | "all">("all");
  const [status, setStatus] = useState<GalleryStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.alt.toLowerCase().includes(q)
      );
    });
  }, [items, search, type, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = items.filter((i) => i.status === "active").length;

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
      successToast("Gallery item deleted.");
      setSelected(new Set());
      setDeleteTarget(null);
    } catch (err) {
      errorToast((err as { message?: string })?.message ?? "Delete failed.", "Error");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Gallery"
        description="Manage photos and videos displayed on the public media page."
        actionLabel="Add Media"
        onAction={() => openDrawer("create-gallery")}
        stats={
          <>
            <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">{items.length} items</Chip>
            <Chip size="sm" variant="flat" className="bg-emerald-100 text-emerald-700">{activeCount} active</Chip>
          </>
        }
      />

      <section className="flex flex-wrap gap-3 rounded-xl border border-text-dark/[0.05] bg-surface p-3">
        <Input placeholder="Search gallery…" value={search} onValueChange={(v) => { setSearch(v); setPage(1); }} startContent={<LuSearch size={16} className="text-text-muted" />} variant="flat" radius="full" className="min-w-[240px] flex-1" classNames={{ inputWrapper: "bg-background/60 border border-text-dark/[0.06]", input: "text-sm" }} />
        <Select selectedKeys={[type]} onSelectionChange={(keys) => { setType(Array.from(keys)[0] as GalleryType | "all"); setPage(1); }} className="w-32" variant="flat" radius="md" aria-label="Type">
          <SelectItem key="all">All Types</SelectItem>
          <>
            {GALLERY_TYPES.map((t) => (
              <SelectItem key={t} className="capitalize">{t}</SelectItem>
            ))}
          </>
        </Select>
        <Select selectedKeys={[status]} onSelectionChange={(keys) => { setStatus(Array.from(keys)[0] as GalleryStatus | "all"); setPage(1); }} className="w-36" variant="flat" radius="md" aria-label="Status">
          <SelectItem key="all">All Status</SelectItem>
          <>
            {GALLERY_STATUSES.map((s) => (
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
          <LuImage size={32} className="text-primary/40" />
          <p className="text-sm text-text-muted">No gallery items yet.</p>
          <Button startContent={<LuPlus size={16} />} className="bg-primary text-white" onPress={() => openDrawer("create-gallery")}>Add Media</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((item) => (
              <AdminContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.category}
                image={item.type === "photo" ? item.url : undefined}
                chips={[
                  { label: item.type, color: item.type === "video" ? "warning" : "default" },
                  { label: item.status, color: item.status === "active" ? "success" : "danger" },
                ]}
                selected={selected.has(item.id)}
                onSelect={toggleSelect}
                onEdit={() => openDrawer("edit-gallery", { body: item })}
                onDelete={() => setDeleteTarget({ ids: [item.id], label: item.title })}
                onClick={() => openDrawer("edit-gallery", { body: item })}
                fallbackIcon={item.type === "video" ? <LuVideo size={32} /> : <LuImage size={32} />}
              />
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Pagination total={pages} page={page} onChange={setPage} size="sm" showControls radius="md" />
          </div>
        </>
      )}

      <BulkActionBar count={selected.size} entityLabel="Item" onClear={() => setSelected(new Set())} onDelete={() => setDeleteTarget({ ids: Array.from(selected), label: `${selected.size} items` })} deleting={deleteBulk.isPending} />
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete gallery item" message={`Remove ${deleteTarget?.label ?? "selected items"}?`} loading={deleteOne.isPending || deleteBulk.isPending} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
