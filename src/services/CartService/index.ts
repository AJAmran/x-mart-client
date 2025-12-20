"use server";

import axiosInstance from "@/src/lib/axios";
import { TCartItem } from "@/src/types";

export const getCart = async (_userId: string) => {
  try {
    const response = await axiosInstance.get(`/cart`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCart = async (userId: string, items: TCartItem[]) => {
  try {
    const response = await axiosInstance.post(`/cart`, { userId, items });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCart = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/cart`, { data: { userId } });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Sync local storage cart with backend
export const syncCartWithBackend = async (userId: string) => {
  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (localCart.length > 0) {
    await updateCart(userId, localCart);
    localStorage.removeItem("cart");
  }
};
