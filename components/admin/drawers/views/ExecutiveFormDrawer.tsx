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
import { useEffect, useMemo, useState } from "react";
import { LuMail, LuPhone } from "react-icons/lu";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";
import { useGetChapters } from "@/service/apis/church";
import {
  useCreateExecutive,
  useUpdateExecutive,
} from "@/service/apis/executive";
import { useGetOffices } from "@/service/apis/office";
import type { AdminExecutive, ExecutiveFormPayload } from "@/types/admin";
import { EXECUTIVE_STATUSES } from "@/types/admin";

interface ExecutiveFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminExecutive;
  onClose: () => void;
}

const currentYear = new Date().getFullYear();

function toForm(initial?: AdminExecutive): ExecutiveFormPayload & { id?: string } {
  return {
    id: initial?.id,
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    office_id: initial?.officeId ?? "",
    church_id: initial?.churchId ?? "",
    start_year: initial?.startYear ?? currentYear,
    end_year: initial?.endYear ?? null,
    status: initial?.status ?? "active",
    description: initial?.description ?? "",
    image: initial?.image ?? null,
    password: "",
    title: "Director's Desk",
  };
}

export function ExecutiveFormDrawer({
  mode,
  initial,
  onClose,
}: ExecutiveFormDrawerProps) {
  const [form, setForm] = useState(toForm(initial));
  const { data: offices = [], isLoading: officesLoading } = useGetOffices();
  const { data: chapters = [], isLoading: chaptersLoading } = useGetChapters();
  const createExecutive = useCreateExecutive();
  const updateExecutive = useUpdateExecutive();

  useEffect(() => {
    setForm(toForm(initial));
  }, [initial]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const saving = createExecutive.isPending || updateExecutive.isPending;
  const isCreate = mode === "create";

  const chapterOptions = useMemo(
    () =>
      chapters.map((c) => ({
        id: c.id,
        label: `${c.chapter} · ${c.name}`,
      })),
    [chapters],
  );

  const handleSave = async () => {
    if (!form.name.trim() || !form.office_id || !form.church_id || !form.phone.trim()) {
      errorToast("Please complete all required fields.", "Validation");
      return;
    }

    const payload: ExecutiveFormPayload = {
      name: form.name.trim(),
      email: form.email?.trim() || undefined,
      phone: form.phone.trim(),
      office_id: form.office_id,
      church_id: form.church_id,
      start_year: Number(form.start_year),
      end_year: form.end_year ? Number(form.end_year) : null,
      status: form.status,
      description: form.description.trim() || "—",
      image: form.image,
      title: form.title,
    };

    if (isCreate) {
      payload.password = form.password?.trim() || "password";
    } else if (form.password?.trim()) {
      payload.password = form.password.trim();
    }

    try {
      if (isCreate) {
        await createExecutive.mutateAsync(payload);
        successToast("Executive created successfully.");
      } else if (initial?.id) {
        await updateExecutive.mutateAsync({ id: initial.id, body: payload });
        successToast("Executive updated successfully.");
      }
      onClose();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Unable to save executive.";
      errorToast(message, "Save failed");
    }
  };

  return (
    <>
      <DrawerHeader className="flex flex-col gap-1 border-b border-text-dark/[0.05] bg-background/40 px-6 py-5">
        <h3 className="text-lg font-semibold tracking-tight text-primary">
          {isCreate ? "Add New Executive" : "Edit Executive"}
        </h3>
        <p className="text-xs text-text-muted">
          Assign office, chapter, and contact details. Active executives appear on
          the public site.
        </p>
      </DrawerHeader>

      <DrawerBody className="space-y-5 px-6 py-6">
        <ImageUploadField
          label="Profile Photo"
          value={form.image}
          onChange={(url) => update("image", url)}
          folder="executives"
          previewName={form.name || "Executive"}
        />

        <Input
          label="Full Name"
          labelPlacement="outside"
          placeholder="e.g. Dr. Sarah Adesina"
          value={form.name}
          onValueChange={(v) => update("name", v)}
          variant="bordered"
          radius="md"
          isRequired
          classNames={inputCx}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Office / Role"
            labelPlacement="outside"
            placeholder="Select office"
            selectedKeys={form.office_id ? [form.office_id] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as string | undefined;
              update("office_id", v ?? "");
            }}
            variant="bordered"
            radius="md"
            isRequired
            isLoading={officesLoading}
            classNames={selectCx}
          >
            {offices.map((office) => (
              <SelectItem key={office.id}>{office.name}</SelectItem>
            ))}
          </Select>

          <Select
            label="Chapter"
            labelPlacement="outside"
            placeholder="Select chapter"
            selectedKeys={form.church_id ? [form.church_id] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as string | undefined;
              update("church_id", v ?? "");
            }}
            variant="bordered"
            radius="md"
            isRequired
            isLoading={chaptersLoading}
            classNames={selectCx}
          >
            {chapterOptions.map((chapter) => (
              <SelectItem key={chapter.id}>{chapter.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            type="number"
            label="Start Year"
            labelPlacement="outside"
            value={String(form.start_year)}
            onValueChange={(v) => update("start_year", Number(v) || currentYear)}
            variant="bordered"
            radius="md"
            classNames={inputCx}
          />
          <Input
            type="number"
            label="End Year"
            labelPlacement="outside"
            placeholder="Optional"
            value={form.end_year ? String(form.end_year) : ""}
            onValueChange={(v) => update("end_year", v ? Number(v) : null)}
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
              if (v) update("status", v);
            }}
            variant="bordered"
            radius="md"
            classNames={selectCx}
          >
            {EXECUTIVE_STATUSES.map((status) => (
              <SelectItem key={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Textarea
          label="Bio / Description"
          labelPlacement="outside"
          minRows={4}
          value={form.description}
          onValueChange={(v) => update("description", v)}
          placeholder="Professional bio shown on the public site…"
          variant="bordered"
          classNames={inputCx}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="email@pba.org"
            value={form.email ?? ""}
            onValueChange={(v) => update("email", v)}
            variant="bordered"
            radius="md"
            startContent={<LuMail size={16} className="text-text-muted" />}
            classNames={inputCx}
          />
          <Input
            type="tel"
            label="Phone"
            labelPlacement="outside"
            placeholder="+234 803 123 4567"
            value={form.phone}
            onValueChange={(v) => update("phone", v)}
            variant="bordered"
            radius="md"
            isRequired
            startContent={<LuPhone size={16} className="text-text-muted" />}
            classNames={inputCx}
          />
        </div>

        <Input
          type={isCreate ? "password" : "text"}
          label={isCreate ? "Login Password" : "Reset Password (optional)"}
          labelPlacement="outside"
          placeholder={isCreate ? "Default: password" : "Leave blank to keep current"}
          value={form.password ?? ""}
          onValueChange={(v) => update("password", v)}
          variant="bordered"
          radius="md"
          classNames={inputCx}
        />
      </DrawerBody>

      <DrawerFooter className="border-t border-text-dark/[0.05] bg-background/40 px-6 py-4">
        <Button
          variant="bordered"
          radius="md"
          onPress={onClose}
          isDisabled={saving}
          className="border-text-dark/15 font-semibold text-text-dark"
        >
          Cancel
        </Button>
        <Button
          radius="md"
          onPress={handleSave}
          isLoading={saving}
          className="bg-primary font-semibold text-white shadow-md hover:bg-[#040e3d]"
        >
          {isCreate ? "Create Executive" : "Save Changes"}
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
