"use server";

import axiosInstance from "@/src/lib/axios";

export const searchItems = async (searchTerm: string) => {
  try {
    const res = await axiosInstance.get(`/products?searchTerm=${searchTerm}`);

    return res.data;
  } catch (error) {
    throw new Error("Failed to search items");
  }
};
