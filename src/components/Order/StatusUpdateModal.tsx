"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import { StatusBadge, orderStatusTone } from "@/src/components/dashboard/StatusBadge";
import { ORDER_STATUS, TOrder } from "@/src/types";

interface StatusUpdateModalProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  selectedOrder?: TOrder | null;
  updateStatus: (
    data: { id: string; status: string; note: string },
    options: any
  ) => void;
  isPending: boolean;
  refetch?: () => void;
}

const StatusUpdateModal = ({
  isOpen = false,
  onOpenChange,
  selectedOrder,
  updateStatus,
  isPending,
  refetch,
}: StatusUpdateModalProps) => {
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Keep the form in sync whenever a different order is opened.
  useEffect(() => {
    setNewStatus(selectedOrder?.status || null);
    setNote("");
  }, [selectedOrder]);

  const handleStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      updateStatus(
        { id: selectedOrder._id, status: newStatus, note },
        {
          onSuccess: () => {
            setNote("");
            onOpenChange?.(false);
            refetch?.();
          },
        }
      );
    }
  };

  return (
    <Modal
      backdrop="blur"
      className="mx-auto my-4 max-w-[90vw] sm:max-w-xl"
      isOpen={isOpen}
      size="lg"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-xl">
        {(onClose) => (
          <>
            <ModalHeader className="border-b border-line-hairline bg-surface-sunken/40 px-5 py-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-title-md font-semibold text-content">
                  Update order status
                </h2>
                {selectedOrder && (
                  <p className="tabular text-label-sm text-content-subtle">
                    Order #{selectedOrder._id.slice(0, 8).toUpperCase()}…
                  </p>
                )}
              </div>
            </ModalHeader>

            <ModalBody className="flex flex-col gap-5 px-5 py-5">
              <div>
                <p className="mb-1.5 text-label-sm font-semibold text-content-muted">
                  Current status
                </p>
                {selectedOrder && (
                  <StatusBadge
                    dot
                    tone={orderStatusTone(selectedOrder.status)}
                  >
                    {selectedOrder.status}
                  </StatusBadge>
                )}
              </div>

              <div>
                <p className="mb-1.5 text-label-sm font-semibold text-content-muted">
                  New status
                </p>
                <Select
                  aria-label="New status"
                  placeholder="Select a status"
                  selectedKeys={newStatus ? [newStatus] : []}
                  size="md"
                  variant="bordered"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {Object.values(ORDER_STATUS).map((status) => (
                    <SelectItem key={status}>{status}</SelectItem>
                  ))}
                </Select>
              </div>

              <Input
                aria-label="Note"
                label="Note (optional)"
                placeholder="Add context for this status change"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </ModalBody>

            <ModalFooter className="flex flex-col-reverse gap-2 border-t border-line-hairline bg-surface-sunken/40 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                color="default"
                variant="light"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isDisabled={!newStatus || isPending}
                isLoading={isPending}
                onPress={handleStatusUpdate}
              >
                Update status
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default StatusUpdateModal;
