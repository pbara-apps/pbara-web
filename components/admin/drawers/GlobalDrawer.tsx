"use client";

import { Drawer, DrawerContent } from "@heroui/react";
import { useDrawer } from "@/store/useDrawer";
import type { AdminExecutive } from "@/types/admin";
import { ExecutiveFormDrawer } from "./views/ExecutiveFormDrawer";
import DirectorDeskView from "../director-desk/DirectorDeskView";

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
            {view === "edit-director-desk" && (
              <DirectorDeskView onClose={onClose} />
            )}

            {/* Add more views here as you create them:
                {view === "create-office" && <OfficeFormDrawer mode="create" onClose={onClose} />}
                {view === "create-news"   && <NewsFormDrawer    mode="create" onClose={onClose} />}
                ...
            */}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
