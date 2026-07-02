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
import { useCreateNews, useUpdateNews } from "@/service/apis/news";
import type { AdminNews, NewsFormPayload } from "@/types/admin";
import { NEWS_CATEGORIES, NEWS_STATUSES } from "@/types/admin";

interface NewsFormDrawerProps {
  mode: "create" | "edit";
  initial?: AdminNews;
  onClose: () => void;
}

export function NewsFormDrawer({ mode, initial, onClose }: NewsFormDrawerProps) {
  const [form, setForm] = useState<NewsFormPayload>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "Announcements",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    image: initial?.image ?? null,
    author: initial?.author ?? "",
    read_time: initial?.readTime ?? 3,
    status: initial?.status ?? "draft",
  });
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      category: initial?.category ?? "Announcements",
      excerpt: initial?.excerpt ?? "",
      content: initial?.content ?? "",
      image: initial?.image ?? null,
      author: initial?.author ?? "",
      read_time: initial?.readTime ?? 3,
      status: initial?.status ?? "draft",
    });
  }, [initial]);

  const saving = createNews.isPending || updateNews.isPending;

  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      errorToast("Title and excerpt are required.", "Validation");
      return;
    }
    try {
      if (mode === "create") {
        await createNews.mutateAsync(form);
        successToast("News article created.");
      } else if (initial?.id) {
        await updateNews.mutateAsync({ id: initial.id, body: form });
        successToast("News article updated.");
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
          {mode === "create" ? "Create News Article" : "Edit News Article"}
        </h3>
      </DrawerHeader>
      <DrawerBody className="space-y-4 px-6 py-6">
        <ImageUploadField
          label="Cover Image"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          folder="news"
          previewName={form.title || "News"}
        />
        <Input label="Title" labelPlacement="outside" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" isRequired classNames={inputCx} />
        <Input label="Slug (optional)" labelPlacement="outside" value={form.slug ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, slug: v }))} variant="bordered" classNames={inputCx} />
        <Select label="Category" labelPlacement="outside" selectedKeys={[form.category]} onSelectionChange={(keys) => setForm((f) => ({ ...f, category: Array.from(keys)[0] as string }))} variant="bordered" classNames={selectCx}>
          {NEWS_CATEGORIES.map((c) => <SelectItem key={c}>{c}</SelectItem>)}
        </Select>
        <Textarea label="Excerpt" labelPlacement="outside" minRows={3} value={form.excerpt} onValueChange={(v) => setForm((f) => ({ ...f, excerpt: v }))} variant="bordered" isRequired classNames={inputCx} />
        <Textarea label="Content" labelPlacement="outside" minRows={6} value={form.content ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, content: v }))} variant="bordered" classNames={inputCx} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Author" labelPlacement="outside" value={form.author ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, author: v }))} variant="bordered" classNames={inputCx} />
          <Input type="number" label="Read time (min)" labelPlacement="outside" value={String(form.read_time ?? 3)} onValueChange={(v) => setForm((f) => ({ ...f, read_time: Number(v) || 3 }))} variant="bordered" classNames={inputCx} />
        </div>
        <Select label="Status" labelPlacement="outside" selectedKeys={[form.status ?? "draft"]} onSelectionChange={(keys) => setForm((f) => ({ ...f, status: Array.from(keys)[0] as typeof form.status }))} variant="bordered" classNames={selectCx}>
          {NEWS_STATUSES.map((s) => <SelectItem key={s} className="capitalize">{s}</SelectItem>)}
        </Select>
      </DrawerBody>
      <DrawerFooter className="border-t border-text-dark/[0.05] px-6 py-4">
        <Button variant="bordered" onPress={onClose} isDisabled={saving}>Cancel</Button>
        <Button onPress={handleSave} isLoading={saving} className="bg-primary text-white">{mode === "create" ? "Publish" : "Save"}</Button>
      </DrawerFooter>
    </>
  );
}

const inputCx = { label: "text-xs font-semibold text-text-dark", inputWrapper: "border-text-dark/15 bg-background/40", input: "text-sm" };
const selectCx = { label: "text-xs font-semibold text-text-dark", trigger: "border-text-dark/15 bg-background/40", value: "text-sm" };
