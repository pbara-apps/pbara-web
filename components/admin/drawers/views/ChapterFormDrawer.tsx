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
import { useCreateChapter, useUpdateChapter } from "@/service/apis/church";
import type { AdminChapter, ChapterFormPayload } from "@/types/admin";
import { CHAPTER_STATUSES } from "@/types/admin";

interface ChapterFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminChapter;
  onClose: () => void;
}

export function ChapterFormDrawer({
  mode,
  initial,
  onClose,
}: ChapterFormDrawerProps) {
  const [form, setForm] = useState<ChapterFormPayload>({
    name: initial?.name ?? "",
    chapter: initial?.chapter ?? "",
    address: initial?.address ?? "",
    counsellor: initial?.counsellor ?? "",
    status: initial?.status ?? "active",
    image: initial?.image ?? null,
  });
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();

  useEffect(() => {
    setForm({
      name: initial?.name ?? "",
      chapter: initial?.chapter ?? "",
      address: initial?.address ?? "",
      counsellor: initial?.counsellor ?? "",
      status: initial?.status ?? "active",
      image: initial?.image ?? null,
    });
  }, [initial]);

  const saving = createChapter.isPending || updateChapter.isPending;
  const isCreate = mode === "create";

  const handleSave = async () => {
    if (!form.name.trim() || !form.chapter.trim()) {
      errorToast("Chapter name and church name are required.", "Validation");
      return;
    }

    const payload: ChapterFormPayload = {
      name: form.name.trim(),
      chapter: form.chapter.trim(),
      address: form.address?.trim() || undefined,
      counsellor: form.counsellor?.trim() || undefined,
      status: form.status,
      image: form.image,
    };

    try {
      if (isCreate) {
        await createChapter.mutateAsync(payload);
        successToast("Chapter created successfully.");
      } else if (initial?.id) {
        await updateChapter.mutateAsync({ id: initial.id, body: payload });
        successToast("Chapter updated successfully.");
      }
      onClose();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Unable to save chapter.";
      errorToast(message, "Save failed");
    }
  };

  return (
    <>
      <DrawerHeader className="flex flex-col gap-1 border-b border-text-dark/[0.05] bg-background/40 px-6 py-5">
        <h3 className="text-lg font-semibold tracking-tight text-primary">
          {isCreate ? "Register Chapter" : "Edit Chapter"}
        </h3>
        <p className="text-xs text-text-muted">
          Chapters represent local RA units linked to a Baptist church.
        </p>
      </DrawerHeader>

      <DrawerBody className="space-y-5 px-6 py-6">
        <ImageUploadField
          label="Chapter Image"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          folder="chapters"
          previewName={form.chapter || "Chapter"}
        />

        <Input
          label="Chapter Name"
          labelPlacement="outside"
          placeholder="e.g. Lagos Central"
          value={form.chapter}
          onValueChange={(v) => setForm((f) => ({ ...f, chapter: v }))}
          variant="bordered"
          radius="md"
          isRequired
          classNames={inputCx}
        />

        <Input
          label="Church Name"
          labelPlacement="outside"
          placeholder="e.g. First Baptist Church, Yaba"
          value={form.name}
          onValueChange={(v) => setForm((f) => ({ ...f, name: v }))}
          variant="bordered"
          radius="md"
          isRequired
          classNames={inputCx}
        />

        <Input
          label="Commander / Counsellor"
          labelPlacement="outside"
          placeholder="Unit commander name"
          value={form.counsellor ?? ""}
          onValueChange={(v) => setForm((f) => ({ ...f, counsellor: v }))}
          variant="bordered"
          radius="md"
          classNames={inputCx}
        />

        <Input
          label="Address"
          labelPlacement="outside"
          placeholder="Church address"
          value={form.address ?? ""}
          onValueChange={(v) => setForm((f) => ({ ...f, address: v }))}
          variant="bordered"
          radius="md"
          classNames={inputCx}
        />

        <Select
          label="Status"
          labelPlacement="outside"
          selectedKeys={[form.status]}
          onSelectionChange={(keys) => {
            const v = Array.from(keys)[0] as typeof form.status | undefined;
            if (v) setForm((f) => ({ ...f, status: v }));
          }}
          variant="bordered"
          radius="md"
          classNames={selectCx}
        >
          {CHAPTER_STATUSES.map((status) => (
            <SelectItem key={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </Select>
      </DrawerBody>

      <DrawerFooter className="border-t border-text-dark/[0.05] bg-background/40 px-6 py-4">
        <Button variant="bordered" radius="md" onPress={onClose} isDisabled={saving}>
          Cancel
        </Button>
        <Button
          radius="md"
          onPress={handleSave}
          isLoading={saving}
          className="bg-primary font-semibold text-white shadow-md hover:bg-[#040e3d]"
        >
          {isCreate ? "Create Chapter" : "Save Changes"}
        </Button>
      </DrawerFooter>
    </>
  );
}

const inputCx = {
  label: "text-xs font-semibold text-text-dark",
  inputWrapper:
    "border-text-dark/15 bg-background/40 data-[hover=true]:border-text-dark/25 group-data-[focus=true]:border-gold/60 group-data-[focus=true]:bg-surface",
  input: "text-sm placeholder:text-text-muted",
};

const selectCx = {
  label: "text-xs font-semibold text-text-dark",
  trigger:
    "border-text-dark/15 bg-background/40 data-[hover=true]:border-text-dark/25 data-[focus=true]:border-gold/60 data-[open=true]:border-gold/60",
  value: "text-sm",
};
