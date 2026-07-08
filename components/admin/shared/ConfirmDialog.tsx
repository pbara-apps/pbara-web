"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="md"
      classNames={{
        backdrop: "bg-primary/40 backdrop-blur-sm",
      }}
    >
      <ModalContent className="border border-text-dark/[0.08] bg-surface shadow-[0_22px_44px_rgba(15,23,42,0.18)]">
        {(close) => (
          <>
            <ModalHeader className="border-b border-text-dark/[0.06] text-primary">
              {title}
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-text-muted">{message}</p>
            </ModalBody>
            <ModalFooter className="border-t border-text-dark/[0.06]">
              <Button
                variant="light"
                onPress={close}
                isDisabled={loading}
                className="focus-ring"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={loading}
                onPress={onConfirm}
                className="focus-ring font-semibold"
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
