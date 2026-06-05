"use client";

import {
  Avatar,
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  cn,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  LuCamera,
  LuLink,
  LuList,
  LuMail,
  LuPhone,
  LuTrash2,
} from "react-icons/lu";
import {
  EXECUTIVE_CHAPTERS,
  EXECUTIVE_ROLES,
  type AdminExecutive,
} from "@/types/admin";

interface ExecutiveFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminExecutive;
  onClose: () => void;
}

const blankExec: AdminExecutive = {
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  chapter: "",
  status: "draft",
  bio: "",
  visible: true,
  image: null,
};

export function ExecutiveFormDrawer({
  mode,
  initial,
  onClose,
}: ExecutiveFormDrawerProps) {
  const [form, setForm] = useState<AdminExecutive>(initial ?? blankExec);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ?? blankExec);
  }, [initial]);

  const update = <K extends keyof AdminExecutive>(
    key: K,
    value: AdminExecutive[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    // TODO: replace with API call
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onClose();
  };

  const isCreate = mode === "create";

  return (
    <>
      <DrawerHeader className="flex flex-col gap-1 border-b border-text-dark/[0.05] bg-background/40 px-6 py-5">
        <h3 className="text-lg font-semibold tracking-tight text-primary">
          {isCreate ? "Add New Executive" : "Edit Executive"}
        </h3>
        <p className="text-xs text-text-muted">
          {isCreate
            ? "Create a new executive profile and assign permissions."
            : "Update profile, role assignment, and public visibility."}
        </p>
      </DrawerHeader>

      <DrawerBody className="space-y-6 px-6 py-6">
        <section className="flex items-center gap-5">
          <div className="relative">
            <Avatar
              src={form.image ?? undefined}
              name={form.name || "?"}
              size="lg"
              className="h-20 w-20 ring-4 ring-surface"
              classNames={{
                base: "bg-gradient-to-br from-primary to-[#040e3d] text-white",
              }}
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-primary shadow-lg ring-4 ring-surface transition-transform hover:scale-105"
              aria-label="Upload photo"
            >
              <LuCamera size={14} />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-dark">
              Profile Picture
            </p>
            <p className="text-xs text-text-muted">JPG or PNG. Max size 2MB.</p>
            {form.image && (
              <button
                type="button"
                onClick={() => update("image", null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
              >
                <LuTrash2 size={12} /> Remove photo
              </button>
            )}
          </div>
        </section>

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
            label="Role"
            labelPlacement="outside"
            placeholder="Select role"
            selectedKeys={form.role ? [form.role] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as string | undefined;
              update("role", v ?? "");
            }}
            variant="bordered"
            radius="md"
            isRequired
            classNames={selectCx}
          >
            {EXECUTIVE_ROLES.map((r) => (
              <SelectItem key={r}>{r}</SelectItem>
            ))}
          </Select>

          <Select
            label="Chapter"
            labelPlacement="outside"
            placeholder="Select chapter"
            selectedKeys={form.chapter ? [form.chapter] : []}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as string | undefined;
              update("chapter", v ?? "");
            }}
            variant="bordered"
            radius="md"
            isRequired
            classNames={selectCx}
          >
            {EXECUTIVE_CHAPTERS.map((c) => (
              <SelectItem key={c}>{c}</SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-text-dark">
            Professional Bio
          </label>
          <div className="overflow-hidden rounded-lg border border-text-dark/15 bg-background/40 transition-colors focus-within:border-gold/60">
            <div className="flex items-center gap-1 border-b border-text-dark/10 bg-background/60 px-2 py-1.5">
              <FormatBtn label="Bold" abbr="B" weight="bold" />
              <FormatBtn label="Italic" abbr="I" weight="italic" />
              <FormatBtn label="List" icon={<LuList size={14} />} />
              <FormatBtn label="Link" icon={<LuLink size={14} />} />
            </div>
            <Textarea
              minRows={4}
              value={form.bio ?? ""}
              onValueChange={(v) => update("bio", v)}
              placeholder="A short professional bio…"
              variant="flat"
              classNames={{
                inputWrapper: "bg-transparent shadow-none",
                input: "text-sm",
              }}
            />
          </div>
        </div>

        <section className="space-y-3">
          <p className="text-xs font-semibold text-text-dark">
            Social Connections
          </p>
          <Input
            type="email"
            placeholder="email@pba.org"
            value={form.email}
            onValueChange={(v) => update("email", v)}
            variant="bordered"
            radius="md"
            startContent={<LuMail size={16} className="text-text-muted" />}
            classNames={inputCx}
          />
          <Input
            type="tel"
            placeholder="+234 803 123 4567"
            value={form.phone ?? ""}
            onValueChange={(v) => update("phone", v)}
            variant="bordered"
            radius="md"
            startContent={<LuPhone size={16} className="text-text-muted" />}
            classNames={inputCx}
          />
        </section>

        <section className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/[0.03] p-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              Public Visibility
            </p>
            <p className="text-xs text-text-muted">
              Allow this profile to appear on the public website.
            </p>
          </div>
          <Switch
            isSelected={form.visible ?? false}
            onValueChange={(v) => update("visible", v)}
            color="warning"
            classNames={{
              wrapper: "group-data-[selected=true]:bg-gold",
            }}
          />
        </section>
      </DrawerBody>

      <DrawerFooter className="border-t border-text-dark/[0.05] bg-background/40 px-6 py-4">
        <Button
          variant="bordered"
          radius="md"
          onPress={onClose}
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

function FormatBtn({
  label,
  abbr,
  weight,
  icon,
}: {
  label: string;
  abbr?: string;
  weight?: "bold" | "italic";
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded text-xs text-text-muted transition-colors hover:bg-text-dark/5 hover:text-text-dark",
        weight === "bold" && "font-bold",
        weight === "italic" && "italic",
      )}
      aria-label={label}
      title={label}
    >
      {icon ?? abbr}
    </button>
  );
}
