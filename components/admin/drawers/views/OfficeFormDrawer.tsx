"use client";

import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Input,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useCreateOffice, useUpdateOffice } from "@/service/apis/office";
import type { AdminOffice, OfficeFormPayload } from "@/types/admin";

interface OfficeFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminOffice;
  onClose: () => void;
}

const blank: OfficeFormPayload = { name: "", description: "" };

export function OfficeFormDrawer({
  mode,
  initial,
  onClose,
}: OfficeFormDrawerProps) {
  const [form, setForm] = useState<OfficeFormPayload>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
  });
  const createOffice = useCreateOffice();
  const updateOffice = useUpdateOffice();

  useEffect(() => {
    setForm({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
    });
  }, [initial]);

  const saving = createOffice.isPending || updateOffice.isPending;
  const isCreate = mode === "create";

  const handleSave = async () => {
    if (!form.name.trim() || form.description.trim().length < 5) {
      errorToast("Name and description (min 5 chars) are required.", "Validation");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };

    try {
      if (isCreate) {
        await createOffice.mutateAsync(payload);
        successToast("Office created successfully.");
      } else if (initial?.id) {
        await updateOffice.mutateAsync({ id: initial.id, body: payload });
        successToast("Office updated successfully.");
      }
      onClose();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Unable to save office.";
      errorToast(message, "Save failed");
    }
  };

  return (
    <>
      <DrawerHeader className="flex flex-col gap-1 border-b border-text-dark/[0.05] bg-background/40 px-6 py-5">
        <h3 className="text-lg font-semibold tracking-tight text-primary">
          {isCreate ? "Add Office / Position" : "Edit Office / Position"}
        </h3>
        <p className="text-xs text-text-muted">
          Offices define executive roles such as President, Treasurer, and
          Director.
        </p>
      </DrawerHeader>

      <DrawerBody className="space-y-5 px-6 py-6">
        <Input
          label="Office Name"
          labelPlacement="outside"
          placeholder="e.g. General Secretary"
          value={form.name}
          onValueChange={(v) => setForm((f) => ({ ...f, name: v }))}
          variant="bordered"
          radius="md"
          isRequired
          classNames={inputCx}
        />
        <Textarea
          label="Description"
          labelPlacement="outside"
          minRows={5}
          value={form.description}
          onValueChange={(v) => setForm((f) => ({ ...f, description: v }))}
          placeholder="Responsibilities and scope of this office…"
          variant="bordered"
          isRequired
          classNames={inputCx}
        />
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
          {isCreate ? "Create Office" : "Save Changes"}
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
