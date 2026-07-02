"use client";

import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";
import { useCreateEvent, useUpdateEvent } from "@/service/apis/event";
import type { AdminEvent, EventFormPayload } from "@/types/admin";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "@/types/admin";

interface EventFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminEvent;
  onClose: () => void;
}

export function EventFormDrawer({ mode, initial, onClose }: EventFormDrawerProps) {
  const [form, setForm] = useState<EventFormPayload>({
    title: initial?.title ?? "",
    category: initial?.category ?? "Golden Ambassador",
    date: initial?.date ?? "",
    venue: initial?.venue ?? "",
    description: initial?.description ?? "",
    image: initial?.image ?? null,
    status: initial?.status ?? "open",
  });
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      category: initial?.category ?? "Golden Ambassador",
      date: initial?.date ?? "",
      venue: initial?.venue ?? "",
      description: initial?.description ?? "",
      image: initial?.image ?? null,
      status: initial?.status ?? "open",
    });
  }, [initial]);

  const saving = createEvent.isPending || updateEvent.isPending;

  const handleSave = async () => {
    if (!form.title.trim() || !form.date.trim() || !form.venue.trim()) {
      errorToast("Title, date, and venue are required.", "Validation");
      return;
    }
    try {
      if (mode === "create") {
        await createEvent.mutateAsync(form);
        successToast("Event created.");
      } else if (initial?.id) {
        await updateEvent.mutateAsync({ id: initial.id, body: form });
        successToast("Event updated.");
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
          {mode === "create" ? "Create Event" : "Edit Event"}
        </h3>
      </DrawerHeader>
      <DrawerBody className="space-y-4 px-6 py-6">
        <ImageUploadField
          label="Cover Image"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          folder="events"
          previewName={form.title || "Event"}
        />
        <Input label="Title" labelPlacement="outside" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" isRequired classNames={inputCx} />
        <Select label="Category" labelPlacement="outside" selectedKeys={[form.category]} onSelectionChange={(keys) => setForm((f) => ({ ...f, category: Array.from(keys)[0] as string }))} variant="bordered" classNames={selectCx}>
          {EVENT_CATEGORIES.map((c) => <SelectItem key={c}>{c}</SelectItem>)}
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" labelPlacement="outside" placeholder="2026-07-12" value={form.date} onValueChange={(v) => setForm((f) => ({ ...f, date: v }))} variant="bordered" isRequired classNames={inputCx} />
          <Select label="Status" labelPlacement="outside" selectedKeys={[form.status ?? "open"]} onSelectionChange={(keys) => setForm((f) => ({ ...f, status: Array.from(keys)[0] as typeof form.status }))} variant="bordered" classNames={selectCx}>
            {EVENT_STATUSES.map((s) => <SelectItem key={s} className="capitalize">{s}</SelectItem>)}
          </Select>
        </div>
        <Input label="Venue" labelPlacement="outside" value={form.venue} onValueChange={(v) => setForm((f) => ({ ...f, venue: v }))} variant="bordered" isRequired classNames={inputCx} />
        <Textarea label="Description" labelPlacement="outside" minRows={5} value={form.description} onValueChange={(v) => setForm((f) => ({ ...f, description: v }))} variant="bordered" isRequired classNames={inputCx} />
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
