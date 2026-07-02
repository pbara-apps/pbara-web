"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { FiX } from "react-icons/fi";
import { isVideoUrl } from "@/lib/media-utils";

export type MediaViewerItem = {
  type: "photo" | "video";
  url: string;
  title: string;
  alt?: string;
};

interface MediaViewerModalProps {
  item: MediaViewerItem | null;
  onClose: () => void;
}

export function MediaViewerModal({ item, onClose }: MediaViewerModalProps) {
  const showVideo = item?.type === "video" && item.url && isVideoUrl(item.url);

  return (
    <Modal
      isOpen={!!item}
      onOpenChange={(open) => !open && onClose()}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-slate-950/95",
        header: "border-b border-white/10",
        body: "p-0",
        closeButton: "text-white hover:bg-white/10",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-between gap-4 text-white">
              <span className="truncate text-base font-semibold">
                {item?.title}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close viewer"
              >
                <FiX size={20} />
              </button>
            </ModalHeader>
            <ModalBody>
              {item ? (
                <div className="flex min-h-[240px] items-center justify-center bg-black p-4 md:p-6">
                  {showVideo ? (
                    <video
                      key={item.url}
                      src={item.url}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[75vh] w-full rounded-lg bg-black object-contain"
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.alt ?? item.title}
                      className="max-h-[75vh] w-full rounded-lg object-contain"
                    />
                  )}
                </div>
              ) : null}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
