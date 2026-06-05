"use client";

import { Drawer, DrawerContent } from "@heroui/react";
import { useDrawer } from "@/store/useDrawer";
import type { AdminExecutive } from "@/types/admin";
import { ExecutiveFormDrawer } from "./views/ExecutiveFormDrawer";

export function GlobalDrawer() {
  const view = useDrawer((s) => s.view);
  const payload = useDrawer((s) => s.payload);
  const size = useDrawer((s) => s.size);
  const placement = useDrawer((s) => s.placement);
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
                initial={payload as AdminExecutive | undefined}
                onClose={onClose}
              />
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
