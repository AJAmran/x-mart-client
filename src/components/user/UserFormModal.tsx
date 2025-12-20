"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useUpdateUser } from "@/src/hooks/useUser";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  profilePhoto: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Made user required since we're only editing now
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      mobileNumber: user?.mobileNumber || "",
      profilePhoto: user?.profilePhoto || "",
    },
  });

  const updateUser = useUpdateUser();

  // Reset form when user prop changes
  useEffect(() => {
    if (user) {
      const defaultValues = {
        name: user.name || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        profilePhoto: user.profilePhoto || "",
      };

      reset(defaultValues);
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      // Only send editable fields for update
      const updateData = {
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        profilePhoto: data.profilePhoto,
      };

      await updateUser.mutateAsync({ id: user._id, userData: updateData });
      toast.success("User updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit User</ModalHeader>
            <ModalBody>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Name"
                  {...register("name")}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  {...register("email")}
                  disabled={true} // Email is typically immutable for existing users
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                />
                <Input
                  label="Mobile Number"
                  {...register("mobileNumber")}
                  errorMessage={errors.mobileNumber?.message}
                  isInvalid={!!errors.mobileNumber}
                />
                <Input
                  label="Profile Photo URL"
                  {...register("profilePhoto")}
                  errorMessage={errors.profilePhoto?.message}
                  isInvalid={!!errors.profilePhoto}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={updateUser.isPending}
                onClick={handleSubmit(onSubmit)}
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserFormModal;
