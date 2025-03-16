"use server";

import axiosInstance from "@/src/lib/axios";
import { TCartItem } from "@/src/types";


// Fetch cart by user ID
export const getCart = async (userId: string) => {
  const response = await axiosInstance.get(`/cart`);
  return response.data;
};

// Update or create cart
export const updateCart = async (userId: string, items: TCartItem[]) => {
  const response = await axiosInstance.post(`/cart`, { items });
  return response.data;
};

// Delete cart
export const deleteCart = async (userId: string) => {
  const response = await axiosInstance.delete(`/cart`);
  return response.data;
};