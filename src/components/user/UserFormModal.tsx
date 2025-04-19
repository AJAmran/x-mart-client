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
import { useCreateUser, useUpdateUser } from "@/src/hooks/useUser";
import { USER_ROLE } from "@/src/constants";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  profilePhoto: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
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

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Reset form when user prop changes
  useEffect(() => {
    console.log("User prop received:", user); // Debug log
    if (user) {
      const defaultValues = {
        name: user.name || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        profilePhoto: user.profilePhoto || "",
      };
      console.log("Resetting form with defaultValues:", defaultValues); // Debug log
      reset(defaultValues);
    } else {
      reset({
        name: "",
        email: "",
        mobileNumber: "",
        profilePhoto: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (user) {
        // Only send editable fields for update
        const updateData = {
          name: data.name,
          email: data.email,
          mobileNumber: data.mobileNumber,
          profilePhoto: data.profilePhoto,
        };
        console.log("Updating user with data:", updateData); // Debug log
        await updateUser.mutateAsync({ id: user._id, userData: updateData });
        toast.success("User updated successfully");
      } else {
        if (!data.password) {
          toast.error("Password is required for new users");
          return;
        }
        // Include role and status for new users, as they may be required
        const createData = {
          ...data,
          role: USER_ROLE.USER,
          status: "ACTIVE",
        };
        console.log("Creating user with data:", createData); // Debug log
        await createUser.mutateAsync(createData);
        toast.success("User created successfully");
      }
      reset();
      onClose();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{user ? "Edit User" : "Create New User"}</ModalHeader>
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
                  disabled={!!user} // Disable email for existing users, as it may be immutable
                />
                <Input
                  label="Mobile Number"
                  {...register("mobileNumber")}
                  errorMessage={errors.mobileNumber?.message}
                  isInvalid={!!errors.mobileNumber}
                />
                {!user && (
                  <Input
                    label="Password"
                    type="password"
                    {...register("password")}
                    errorMessage={errors.password?.message}
                    isInvalid={!!errors.password}
                  />
                )}
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
                isLoading={createUser.isPending || updateUser.isPending}
              >
                {user ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserFormModal;
