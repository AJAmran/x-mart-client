"use client";

import { useEffect, useRef, useState } from "react";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

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
  const [newStatus, setNewStatus] = useState(selectedOrder?.status || "");
  const [note, setNote] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: keyof typeof ORDER_STATUS) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PROCESSING":
        return "primary";
      case "SHIPPED":
        return "secondary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  const handleStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      updateStatus(
        { id: selectedOrder._id, status: newStatus, note },
        {
          onSuccess: () => {
            setNewStatus("");
            setNote("");
            onOpenChange?.(false);
            refetch?.();
          },
        }
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, status: string) => {
    if (e.key === "Enter" || e.key === " ") {
      setNewStatus(status);
      setIsStatusDropdownOpen(false);
    }
  };

  return (
    <Modal
      backdrop="blur"
      className="max-w-[90vw] sm:max-w-2xl mx-auto my-4 sm:my-8"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
    >
      <ModalContent className="bg-white rounded-lg shadow-xl">
        {(onClose) => (
          <>
            <ModalHeader className="border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Update Order Status
                </h2>
                {selectedOrder && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Order #{selectedOrder._id.slice(0, 8)}...
                  </p>
                )}
              </div>
            </ModalHeader>

            <ModalBody className="px-4 sm:px-6 py-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label
                  htmlFor="current-status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Status
                </label>
                {selectedOrder && (
                  <Chip
                    className="px-3 sm:px-4 py-1 sm:py-2 text-sm"
                    color={getStatusColor(selectedOrder.status)}
                    variant="dot"
                    id="current-status"
                  >
                    {selectedOrder.status}
                  </Chip>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="new-status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Status
                </label>

                <div
                  ref={triggerRef}
                  aria-controls="status-dropdown"
                  aria-expanded={isStatusDropdownOpen}
                  className="h-10 sm:h-12 w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-status"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  role="combobox"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    }
                  }}
                >
                  <span
                    className={
                      newStatus
                        ? "text-gray-900 text-sm"
                        : "text-gray-400 text-sm"
                    }
                  >
                    {newStatus || "Select new status"}
                  </span>
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {isStatusDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto sm:max-h-80"
                    id="status-dropdown"
                    role="listbox"
                  >
                    <ul className="py-1">
                      {Object.values(ORDER_STATUS).map((status) => (
                        <li
                          key={status}
                          aria-selected={newStatus === status}
                          className="px-3 sm:px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-900 text-sm sm:text-base transition-colors"
                          onClick={() => {
                            setNewStatus(status);
                            setIsStatusDropdownOpen(false);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, status)}
                          role="option"
                          tabIndex={0}
                        >
                          {status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Input
                className="focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                id="status-note"
                label="Note (Optional)"
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any notes about this status change"
                value={note}
              />
            </ModalBody>

            <ModalFooter className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                className="w-full sm:w-auto hover:bg-gray-100 text-sm sm:text-base"
                color="default"
                onPress={onClose}
                variant="light"
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                color="primary"
                isDisabled={!newStatus || isPending}
                isLoading={isPending}
                onPress={handleStatusUpdate}
              >
                Update Status
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default StatusUpdateModal;
