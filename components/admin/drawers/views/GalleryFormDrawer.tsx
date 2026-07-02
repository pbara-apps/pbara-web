"use client";

import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";
import {
  useCreateGalleryItem,
  useUpdateGalleryItem,
} from "@/service/apis/gallery";
import type { AdminGalleryItem, GalleryFormPayload } from "@/types/admin";
import { GALLERY_STATUSES, GALLERY_TYPES } from "@/types/admin";

interface GalleryFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminGalleryItem;
  onClose: () => void;
}

export function GalleryFormDrawer({
  mode,
  initial,
  onClose,
}: GalleryFormDrawerProps) {
  const [form, setForm] = useState<GalleryFormPayload>({
    title: initial?.title ?? "",
    alt: initial?.alt ?? "",
    url: initial?.url ?? "",
    type: initial?.type ?? "photo",
    category: initial?.category ?? "General",
    status: initial?.status ?? "active",
    sort_order: initial?.sortOrder ?? 0,
  });
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      alt: initial?.alt ?? "",
      url: initial?.url ?? "",
      type: initial?.type ?? "photo",
      category: initial?.category ?? "General",
      status: initial?.status ?? "active",
      sort_order: initial?.sortOrder ?? 0,
    });
  }, [initial]);

  const saving = createItem.isPending || updateItem.isPending;

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      errorToast("Title and media file are required.", "Validation");
      return;
    }
    try {
      if (mode === "create") {
        await createItem.mutateAsync(form);
        successToast("Gallery item created.");
      } else if (initial?.id) {
        await updateItem.mutateAsync({ id: initial.id, body: form });
        successToast("Gallery item updated.");
      }
      onClose();
    } catch (err) {
      errorToast((err as { message?: string })?.message ?? "Save failed.", "Error");
    }
  };

  return (
    <>
      <DrawerHeader className="border-b border-text-dark/[0.05] bg-background/40 px-6 py-5">
        <h3 className="text-lg font-semibold text-primary">
          {mode === "create" ? "Add Gallery Item" : "Edit Gallery Item"}
        </h3>
      </DrawerHeader>
      <DrawerBody className="space-y-4 px-6 py-6">
        <ImageUploadField
          label="Media"
          value={form.url}
          onChange={(url) => setForm((f) => ({ ...f, url: url ?? "" }))}
          folder="gallery"
          previewName={form.title || "Gallery"}
          accept="media"
        />
        <Input label="Title" labelPlacement="outside" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" isRequired classNames={inputCx} />
        <Input label="Alt text" labelPlacement="outside" value={form.alt ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, alt: v }))} variant="bordered" classNames={inputCx} />
        <Input label="Category" labelPlacement="outside" value={form.category ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))} variant="bordered" classNames={inputCx} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Type" labelPlacement="outside" selectedKeys={[form.type ?? "photo"]} onSelectionChange={(keys) => setForm((f) => ({ ...f, type: Array.from(keys)[0] as typeof form.type }))} variant="bordered" classNames={selectCx}>
            {GALLERY_TYPES.map((t) => <SelectItem key={t} className="capitalize">{t}</SelectItem>)}
          </Select>
          <Select label="Status" labelPlacement="outside" selectedKeys={[form.status ?? "active"]} onSelectionChange={(keys) => setForm((f) => ({ ...f, status: Array.from(keys)[0] as typeof form.status }))} variant="bordered" classNames={selectCx}>
            {GALLERY_STATUSES.map((s) => <SelectItem key={s} className="capitalize">{s}</SelectItem>)}
          </Select>
        </div>
        <Input type="number" label="Sort order" labelPlacement="outside" value={String(form.sort_order ?? 0)} onValueChange={(v) => setForm((f) => ({ ...f, sort_order: Number(v) || 0 }))} variant="bordered" classNames={inputCx} />
      </DrawerBody>
      <DrawerFooter className="border-t border-text-dark/[0.05] px-6 py-4">
        <Button variant="bordered" onPress={onClose} isDisabled={saving}>Cancel</Button>
        <Button onPress={handleSave} isLoading={saving} className="bg-primary text-white">Save</Button>
      </DrawerFooter>
    </>
  );
}

const inputCx = { label: "text-xs font-semibold text-text-dark", inputWrapper: "border-text-dark/15 bg-background/40", input: "text-sm" };
const selectCx = { label: "text-xs font-semibold text-text-dark", trigger: "border-text-dark/15 bg-background/40", value: "text-sm" };
