import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import api from "../lib/axios";

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/auth/login", data),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data.data;
      
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
  });
};

// Register mutation
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      mobileNumber: string;
    }) => api.post("/auth/register", data),
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.post("/logout"),
    onSuccess: () => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      queryClient.clear();
      router.push("/auth/login");
    },
  });
};

// Fetch current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.get("/me").then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
