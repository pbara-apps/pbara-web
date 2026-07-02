"use client";

import { Avatar, Button, Input, Spinner, cn } from "@heroui/react";
import { useRef, useState } from "react";
import { LuImage, LuTrash2, LuUpload } from "react-icons/lu";
import {
  errorToast,
  successToast,
} from "@/components/shared/toast-notification/toast-notification";
import { useUploadMedia } from "@/service/apis/upload";

type UploadFolder =
  | "news"
  | "executives"
  | "events"
  | "chapters"
  | "gallery"
  | "general";

interface ImageUploadFieldProps {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: UploadFolder;
  previewName?: string;
  accept?: "image" | "media";
  showUrlFallback?: boolean;
}

export function ImageUploadField({
  label = "Image",
  value,
  onChange,
  folder = "general",
  previewName = "?",
  accept = "image",
  showUrlFallback = true,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMedia = useUploadMedia();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;

    if (accept === "image" && !file.type.startsWith("image/")) {
      errorToast("Please select an image file.", "Invalid file");
      return;
    }

    if (
      accept === "media" &&
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      errorToast("Please select an image or video file.", "Invalid file");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadMedia.mutateAsync({ file, folder });
      onChange(result.url);
      successToast("File uploaded successfully.");
    } catch (err) {
      errorToast(
        (err as { message?: string })?.message ?? "Upload failed.",
        "Upload error",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isVideo = value?.includes("/video/") || value?.match(/\.(mp4|webm|mov)(\?|$)/i);

  return (
    <section className="rounded-xl border border-text-dark/10 bg-background/40 p-4">
      <p className="mb-3 text-xs font-semibold text-text-dark">{label}</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          {value && isVideo ? (
            <div className="flex h-24 w-36 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-2 ring-surface">
              <video src={value} className="h-full w-full object-cover" muted />
            </div>
          ) : (
            <Avatar
              src={value ?? undefined}
              name={previewName}
              className="h-24 w-24 ring-4 ring-surface"
              classNames={{
                base: cn(
                  "bg-gradient-to-br from-primary to-[#040e3d] text-white",
                  !value && "opacity-80",
                ),
              }}
            />
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
              <Spinner size="sm" color="primary" />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept === "media" ? "image/*,video/*" : "image/*"}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              radius="md"
              variant="flat"
              startContent={<LuUpload size={14} />}
              isLoading={uploading}
              onPress={() => inputRef.current?.click()}
              className="bg-primary/10 font-semibold text-primary"
            >
              {value ? "Replace file" : "Upload file"}
            </Button>
            {value ? (
              <Button
                size="sm"
                radius="md"
                variant="light"
                color="danger"
                startContent={<LuTrash2 size={14} />}
                isDisabled={uploading}
                onPress={() => onChange(null)}
              >
                Remove
              </Button>
            ) : null}
          </div>

          <p className="text-[11px] text-text-muted">
            {accept === "media"
              ? "Upload JPG, PNG, WEBP, MP4, or WEBM. Max 10 MB."
              : "Upload JPG, PNG, or WEBP. Max 10 MB."}
          </p>

          {showUrlFallback ? (
            <Input
              label="Or paste URL"
              labelPlacement="outside"
              placeholder="https://…"
              value={value ?? ""}
              onValueChange={(v) => onChange(v || null)}
              variant="bordered"
              radius="md"
              size="sm"
              startContent={<LuImage size={14} className="text-text-muted" />}
              classNames={{
                label: "text-[11px] font-semibold text-text-dark",
                inputWrapper: "border-text-dark/15 bg-surface",
                input: "text-xs",
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
