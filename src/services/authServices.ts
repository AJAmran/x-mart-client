import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  profilePhoto: string;
};

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", response.data.accessToken);
  }
  return response.data;
};

// export const useLogout = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: logoutUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//     },
//   });
// };
