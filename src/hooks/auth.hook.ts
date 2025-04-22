import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { changePassword, loginUser, registerUser } from "../services/AuthService";

export const useUserRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_REGISTRATION"],
    mutationFn: async (userData) => await registerUser(userData),
    onSuccess: () => {
      toast.success("User registration successful. Please log in.");
    },
    onError: (error) => {
      toast.error(error.message); 
    },
  });
};

export const useUserLogin = (onSuccess?: () => void) => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: async (userData) => await loginUser(userData),
    onSuccess: () => {
      toast.success("User login successful.");
      onSuccess?.(); 
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};


export const useChangePassword = () => {
  return useMutation<any, Error, { oldPassword: string; newPassword: string }>({
    mutationKey: ["CHANGE_PASSWORD"],
    mutationFn: async (passwordData) => await changePassword(passwordData),
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};