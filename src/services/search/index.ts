"use server";

import axiosInstance from "@/src/lib/serverAxios";

export const searchItems = async (searchTerm: string) => {
  try {
    const res = await axiosInstance.get(`/products?searchTerm=${searchTerm}`);

    return res.data;
  } catch {
    throw new Error("Failed to search items");
  }
};
