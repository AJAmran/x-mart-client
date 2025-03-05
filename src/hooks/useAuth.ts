import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import api from "../lib/axios";

interface DecodedToken {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  status: string;
  profilePhoto?: string;
  exp: number;
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/auth/login", data),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;

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

// Function to get user from token
const getCurrentUser = (): DecodedToken | null => {
  try {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) return null; // No token, user is not authenticated

    const decoded: DecodedToken = jwtDecode(accessToken);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};



// Hook to fetch current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
    retry: false, // Avoid retrying if the token is invalid
  });
};