"use server";

import axiosInstance from "@/src/lib/axios";
import { TProduct } from "@/src/types";

// Create a product
export const createProduct = async (data: TProduct) => {
  const response = await axiosInstance.post("/products", data);

  return response.data;
};

// Get all products with filters, sorting, and pagination
export const getAllProducts = async (
  filters: {
    searchTerm?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    status?: string;
  },
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) => {
  const response = await axiosInstance.get("/products", {
    params: {
      ...filters,
      page: options.page || 1,
      limit: options.limit || 10,
      sortBy: options.sortBy || "createdAt",
      sortOrder: options.sortOrder || "desc",
    },
  });

  return response.data;
};

// Get a single product by ID
export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);

  return response.data;
};

// Update a product
export const updateProduct = async (id: string, data: Partial<TProduct>) => {
  const response = await axiosInstance.patch(`/products/${id}`, data);

  return response.data;
};

// Delete a product
export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/products/${id}`);

  return response.data;
};

// Update stock
export const updateStock = async (id: string, stock: number) => {
  const response = await axiosInstance.patch(`/products/${id}/update-stock`, {
    stock,
  });

  return response.data;
};

// Apply discount
export const applyDiscount = async (id: string, discount: any) => {
  const response = await axiosInstance.post(
    `/products/${id}/apply-discount`,
    discount
  );

  return response.data;
};

// Remove discount
export const removeDiscount = async (id: string) => {
  const response = await axiosInstance.delete(
    `/products/${id}/remove-discount`
  );
  
  return response.data;
};