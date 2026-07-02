"use client";

import { Drawer, DrawerContent } from "@heroui/react";
import { useDrawer } from "@/store/useDrawer";
import type {
  AdminChapter,
  AdminEvent,
  AdminExecutive,
  AdminGalleryItem,
  AdminNews,
  AdminOffice,
} from "@/types/admin";
import DirectorDeskView from "../director-desk/DirectorDeskView";
import { ChapterFormDrawer } from "./views/ChapterFormDrawer";
import { EventFormDrawer } from "./views/EventFormDrawer";
import { ExecutiveFormDrawer } from "./views/ExecutiveFormDrawer";
import { GalleryFormDrawer } from "./views/GalleryFormDrawer";
import { NewsFormDrawer } from "./views/NewsFormDrawer";
import { OfficeFormDrawer } from "./views/OfficeFormDrawer";

export function GlobalDrawer() {
  const view = useDrawer((s) => s.view);
  const body = useDrawer((s) => s.body);
  const size = useDrawer((s) => s.config.size);
  const placement = useDrawer((s) => s.config.placement);
  const closeDrawer = useDrawer((s) => s.closeDrawer);

  const isOpen = view !== null;

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) closeDrawer();
      }}
      placement={placement}
      size={size}
      backdrop="blur"
      hideCloseButton
      classNames={{
        base: "bg-surface text-text-dark font-body",
        backdrop: "bg-primary/30 backdrop-blur-sm",
        wrapper: "z-[80]",
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            {view === "create-executive" && (
              <ExecutiveFormDrawer mode="create" onClose={onClose} />
            )}
            {view === "edit-executive" && (
              <ExecutiveFormDrawer
                mode="edit"
                initial={body as unknown as AdminExecutive | undefined}
                onClose={onClose}
              />
            )}
            {view === "create-office" && (
              <OfficeFormDrawer mode="create" onClose={onClose} />
            )}
            {view === "edit-office" && (
              <OfficeFormDrawer
                mode="edit"
                initial={body as unknown as AdminOffice | undefined}
                onClose={onClose}
              />
            )}
            {view === "create-church" && (
              <ChapterFormDrawer mode="create" onClose={onClose} />
            )}
            {view === "edit-church" && (
              <ChapterFormDrawer
                mode="edit"
                initial={body as unknown as AdminChapter | undefined}
                onClose={onClose}
              />
            )}
            {view === "create-news" && (
              <NewsFormDrawer mode="create" onClose={onClose} />
            )}
            {view === "edit-news" && (
              <NewsFormDrawer
                mode="edit"
                initial={body as unknown as AdminNews | undefined}
                onClose={onClose}
              />
            )}
            {view === "create-event" && (
              <EventFormDrawer mode="create" onClose={onClose} />
            )}
            {view === "edit-event" && (
              <EventFormDrawer
                mode="edit"
                initial={body as unknown as AdminEvent | undefined}
                onClose={onClose}
              />
            )}
            {view === "create-gallery" && (
              <GalleryFormDrawer mode="create" onClose={onClose} />
            )}
            {view === "edit-gallery" && (
              <GalleryFormDrawer
                mode="edit"
                initial={body as unknown as AdminGalleryItem | undefined}
                onClose={onClose}
              />
            )}
            {view === "edit-director-desk" && (
              <DirectorDeskView onClose={onClose} />
            )}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
