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
    console.log("User prop received:", user);
    if (user) {
      const defaultValues = {
        name: user.name || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        profilePhoto: user.profilePhoto || "",
      };
      console.log("Resetting form with defaultValues:", defaultValues);
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
      console.log("Updating user with data:", updateData);
      await updateUser.mutateAsync({ id: user._id, userData: updateData });
      toast.success("User updated successfully");
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to update user");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit User</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                  disabled={true} // Email is typically immutable for existing users
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
                onClick={handleSubmit(onSubmit)}
                isLoading={updateUser.isPending}
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
