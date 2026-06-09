"use server";

import axiosInstance from "@/src/lib/serverAxios";
import { TCartItem } from "@/src/types";

export const getCart = async (_userId: string) => {
  try {
    const response = await axiosInstance.get(`/cart`);

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateCart = async (userId: string, items: TCartItem[]) => {
  try {
    const response = await axiosInstance.post(`/cart`, { userId, items });

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteCart = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/cart`, { data: { userId } });

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};


