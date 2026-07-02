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
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="md">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="text-primary">{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-text-muted">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={close} isDisabled={loading}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={loading}
                onPress={onConfirm}
                className="font-semibold"
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
