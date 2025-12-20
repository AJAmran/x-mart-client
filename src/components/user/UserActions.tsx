"use client";

import React from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { useDeleteUser, useUpdateUserStatus } from "@/src/hooks/useUser";
import { toast } from "sonner";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { USER_STATUS } from "@/src/constants";
import { Button } from "@nextui-org/button";

interface UserActionsProps {
  user: any;
  onEdit: () => void;
  onDelete: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ id: user._id, status });
      onDelete();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(user._id);
      onDelete();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <MoreVertical size={16} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions">
        <DropdownItem
          key="edit"
          startContent={<Edit size={16} />}
          onClick={onEdit}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          key="active"
          onClick={() => handleStatusChange(USER_STATUS.ACTIVE)}
        >
          Set Active
        </DropdownItem>
        <DropdownItem
          key="blocked"
          onClick={() => handleStatusChange(USER_STATUS.BLOCKED)}
        >
          Set Blocked
        </DropdownItem>
        <DropdownItem
          key="delete"
          className="text-danger"
          startContent={<Trash size={16} />}
          onClick={handleDelete}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserActions;
