"use client";

import {
  Button,
  Chip,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Input,
  Progress,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import { LuImage, LuTrash2, LuVideo } from "react-icons/lu";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { MultiMediaUploadZone } from "@/components/admin/shared/MultiMediaUploadZone";
import {
  useCreateGalleryBulk,
} from "@/service/apis/gallery";
import { useUploadMedia } from "@/service/apis/upload";
import type { GalleryFormPayload, GalleryStatus, GalleryType } from "@/types/admin";
import { GALLERY_STATUSES, GALLERY_TYPES } from "@/types/admin";

type DraftStatus = "uploading" | "ready" | "error";

interface DraftGalleryItem {
  id: string;
  url: string;
  title: string;
  alt: string;
  type: GalleryType;
  status: DraftStatus;
  error?: string;
}

interface SharedDefaults {
  category: string;
  type: GalleryType | "auto";
  status: GalleryStatus;
  sort_order: number;
}

interface GalleryBulkCreateFormProps {
  onClose: () => void;
}

const MAX_ITEMS = 50;
const UPLOAD_CONCURRENCY = 4;

function titleFromFilename(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return base.replace(/\b\w/g, (char) => char.toUpperCase());
}

function typeFromFile(file: File): GalleryType {
  return file.type.startsWith("video/") ? "video" : "photo";
}

function isVideoUrl(url: string) {
  return url.includes("/video/") || /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

function newDraftId() {
  return crypto.randomUUID();
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await fn(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

export function GalleryBulkCreateForm({ onClose }: GalleryBulkCreateFormProps) {
  const uploadMedia = useUploadMedia();
  const createBulk = useCreateGalleryBulk();

  const [shared, setShared] = useState<SharedDefaults>({
    category: "General",
    type: "auto",
    status: "active",
    sort_order: 0,
  });
  const [items, setItems] = useState<DraftGalleryItem[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);

  const readyItems = useMemo(
    () => items.filter((item) => item.status === "ready"),
    [items],
  );
  const uploadingItems = useMemo(
    () => items.filter((item) => item.status === "uploading"),
    [items],
  );
  const failedItems = useMemo(
    () => items.filter((item) => item.status === "error"),
    [items],
  );

  const updateItem = useCallback((id: string, patch: Partial<DraftGalleryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const remaining = MAX_ITEMS - items.length;
      if (remaining <= 0) {
        errorToast(`You can add up to ${MAX_ITEMS} items at a time.`, "Limit reached");
        return;
      }

      const batch = files.slice(0, remaining);
      const placeholders: DraftGalleryItem[] = batch.map((file) => ({
        id: newDraftId(),
        url: "",
        title: titleFromFilename(file.name),
        alt: "",
        type: shared.type === "auto" ? typeFromFile(file) : shared.type,
        status: "uploading",
      }));

      setItems((prev) => [...prev, ...placeholders]);
      setUploadingCount((count) => count + batch.length);

      await mapWithConcurrency(batch, UPLOAD_CONCURRENCY, async (file, index) => {
        const draft = placeholders[index];
        try {
          const result = await uploadMedia.mutateAsync({ file, folder: "gallery" });
          updateItem(draft.id, {
            url: result.url,
            type:
              shared.type === "auto"
                ? result.resourceType === "video"
                  ? "video"
                  : "photo"
                : shared.type,
            status: "ready",
            error: undefined,
          });
        } catch (err) {
          updateItem(draft.id, {
            status: "error",
            error:
              (err as { message?: string })?.message ?? "Upload failed.",
          });
        } finally {
          setUploadingCount((count) => Math.max(0, count - 1));
        }
      });
    },
    [items.length, shared.type, updateItem, uploadMedia],
  );

  const handleSave = async () => {
    if (uploadingItems.length > 0 || uploadingCount > 0) {
      errorToast("Wait for all uploads to finish.", "Upload in progress");
      return;
    }

    const payload: GalleryFormPayload[] = readyItems
      .filter((item) => item.title.trim() && item.url.trim())
      .map((item, index) => ({
        title: item.title.trim(),
        alt: item.alt.trim() || item.title.trim(),
        url: item.url.trim(),
        type: item.type,
        category: shared.category.trim() || "General",
        status: shared.status,
        sort_order: (shared.sort_order ?? 0) + index,
      }));

    if (payload.length === 0) {
      errorToast("Add at least one media file with a title.", "Validation");
      return;
    }

    try {
      await createBulk.mutateAsync(payload);
      successToast(
        `${payload.length} gallery item${payload.length === 1 ? "" : "s"} added.`,
      );
      onClose();
    } catch (err) {
      errorToast((err as { message?: string })?.message ?? "Save failed.", "Error");
    }
  };

  const saving = createBulk.isPending;
  const canSave = readyItems.length > 0 && uploadingCount === 0 && !saving;
  const uploadProgress =
    items.length === 0
      ? 0
      : Math.round(
          ((items.length - uploadingItems.length) / items.length) * 100,
        );

  return (
    <>
      <DrawerHeader className="border-b border-text-dark/[0.05] bg-background/40 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-primary">Add Gallery Media</h3>
          <p className="mt-1 text-xs text-text-muted">
            Upload multiple photos or videos, then review details before saving.
          </p>
        </div>
      </DrawerHeader>

      <DrawerBody className="space-y-5 px-6 py-6">
        <section className="rounded-xl border border-text-dark/10 bg-surface p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Shared defaults
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Category"
              labelPlacement="outside"
              value={shared.category}
              onValueChange={(v) => setShared((s) => ({ ...s, category: v }))}
              variant="bordered"
              classNames={inputCx}
            />
            <Input
              type="number"
              label="Starting sort order"
              labelPlacement="outside"
              value={String(shared.sort_order)}
              onValueChange={(v) =>
                setShared((s) => ({ ...s, sort_order: Number(v) || 0 }))
              }
              variant="bordered"
              classNames={inputCx}
            />
            <Select
              label="Default type"
              labelPlacement="outside"
              selectedKeys={[shared.type]}
              onSelectionChange={(keys) =>
                setShared((s) => ({
                  ...s,
                  type: Array.from(keys)[0] as SharedDefaults["type"],
                }))
              }
              variant="bordered"
              classNames={selectCx}
            >
              <SelectItem key="auto">Auto-detect</SelectItem>
              <>
                {GALLERY_TYPES.map((t) => (
                  <SelectItem key={t} className="capitalize">
                    {t}
                  </SelectItem>
                ))}
              </>
            </Select>
            <Select
              label="Status"
              labelPlacement="outside"
              selectedKeys={[shared.status]}
              onSelectionChange={(keys) =>
                setShared((s) => ({
                  ...s,
                  status: Array.from(keys)[0] as GalleryStatus,
                }))
              }
              variant="bordered"
              classNames={selectCx}
            >
              <>
                {GALLERY_STATUSES.map((s) => (
                  <SelectItem key={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>
        </section>

        <MultiMediaUploadZone
          onFilesSelected={handleFilesSelected}
          disabled={uploadingCount > 0 || saving || items.length >= MAX_ITEMS}
          maxFiles={MAX_ITEMS - items.length}
        />

        {items.length > 0 && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text-dark">
                  Uploaded items ({items.length})
                </p>
                <p className="text-xs text-text-muted">
                  {readyItems.length} ready
                  {uploadingItems.length > 0 ? ` · ${uploadingItems.length} uploading` : ""}
                  {failedItems.length > 0 ? ` · ${failedItems.length} failed` : ""}
                </p>
              </div>
              {uploadingItems.length > 0 && (
                <Chip size="sm" variant="flat" className="bg-primary/10 text-primary">
                  Uploading…
                </Chip>
              )}
            </div>

            {uploadingItems.length > 0 && (
              <Progress
                size="sm"
                value={uploadProgress}
                className="max-w-full"
                color="primary"
                aria-label="Upload progress"
              />
            )}

            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-text-dark/10 bg-background/40 p-3"
                >
                  <div className="flex gap-3">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-primary/5">
                      {item.status === "uploading" ? (
                        <div className="flex h-full w-full items-center justify-center">
                          <Spinner size="sm" color="primary" />
                        </div>
                      ) : item.url && isVideoUrl(item.url) ? (
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : item.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.alt || item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary/40">
                          {item.type === "video" ? (
                            <LuVideo size={24} aria-hidden />
                          ) : (
                            <LuImage size={24} aria-hidden />
                          )}
                        </div>
                      )}
                      <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip
                            size="sm"
                            variant="flat"
                            className={
                              item.type === "video"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }
                          >
                            {item.type}
                          </Chip>
                          {item.status === "error" && (
                            <Chip size="sm" color="danger" variant="flat">
                              Failed
                            </Chip>
                          )}
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label={`Remove ${item.title || "item"}`}
                          onPress={() => removeItem(item.id)}
                        >
                          <LuTrash2 size={16} />
                        </Button>
                      </div>

                      <Input
                        label="Title"
                        labelPlacement="outside"
                        size="sm"
                        value={item.title}
                        onValueChange={(v) => updateItem(item.id, { title: v })}
                        variant="bordered"
                        isDisabled={item.status === "uploading"}
                        isRequired
                        classNames={compactInputCx}
                      />
                      <Input
                        label="Alt text"
                        labelPlacement="outside"
                        size="sm"
                        value={item.alt}
                        onValueChange={(v) => updateItem(item.id, { alt: v })}
                        variant="bordered"
                        isDisabled={item.status === "uploading"}
                        placeholder={item.title || "Describe this media"}
                        classNames={compactInputCx}
                      />
                      {item.error && (
                        <p className="text-xs text-danger">{item.error}</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </DrawerBody>

      <DrawerFooter className="border-t border-text-dark/[0.05] px-6 py-4">
        <Button variant="bordered" onPress={onClose} isDisabled={saving}>
          Cancel
        </Button>
        <Button
          onPress={handleSave}
          isLoading={saving}
          isDisabled={!canSave}
          className="bg-primary text-white"
        >
          {readyItems.length > 0
            ? `Add ${readyItems.length} item${readyItems.length === 1 ? "" : "s"}`
            : "Add items"}
        </Button>
      </DrawerFooter>
    </>
  );
}

const inputCx = {
  label: "text-xs font-semibold text-text-dark",
  inputWrapper: "border-text-dark/15 bg-background/40",
  input: "text-sm",
};

const selectCx = {
  label: "text-xs font-semibold text-text-dark",
  trigger: "border-text-dark/15 bg-background/40",
  value: "text-sm",
};

const compactInputCx = {
  label: "text-[11px] font-semibold text-text-dark",
  inputWrapper: "border-text-dark/15 bg-surface",
  input: "text-sm",
};
