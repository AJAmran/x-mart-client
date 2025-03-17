"use server";

import axiosInstance from "@/src/lib/axios";
import { TCartItem } from "@/src/types";

export const getCart = async (userId: string) => {
  try {
    console.log("Fetching cart for userId:", userId); // Log the userId
    const response = await axiosInstance.get(`/cart`);
    console.log("GET /cart response:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("GET /cart error:", error); // Log the error
    throw error;
  }
};

export const updateCart = async (userId: string, items: TCartItem[]) => {
  try {
    console.log("Updating cart for userId:", userId); // Log the userId
    console.log("Items to update:", items); // Log the items
    const response = await axiosInstance.post(`/cart`, { userId, items });
    console.log("POST /cart response:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("POST /cart error:", error); // Log the error
    throw error;
  }
};

export const deleteCart = async (userId: string) => {
  try {
    console.log("Deleting cart for userId:", userId); // Log the userId
    const response = await axiosInstance.delete(`/cart`, { data: { userId } });
    console.log("DELETE /cart response:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("DELETE /cart error:", error); // Log the error
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
