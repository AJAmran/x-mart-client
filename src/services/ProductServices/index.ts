"use server";

import axiosInstance from "@/src/lib/axios";
import { TDiscount, TProduct } from "@/src/types";

// Create a product
export async function createProduct(data: TProduct) {
  const response = await axiosInstance.post("/products", data);

  return response.data;
}

// Get all products with advanced filters
export async function getAllProducts(
  filters: {
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    availability?: string;
    operationType?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    branchId?: string;
    hasDiscount?: boolean;
  },
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) {
  const params = {
    ...filters,
    page: options.page || 1,
    limit: options.limit || 10,
    sortBy: options.sortBy || "createdAt",
    sortOrder: options.sortOrder || "desc",
  };

  const response = await axiosInstance.get("/products", { params });

  return response.data;
}

// Advanced product search
export async function advancedProductSearch(
  filters: {
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    availability?: string;
    operationType?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    branchId?: string;
    hasDiscount?: boolean;
  },
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) {
  const params = {
    ...filters,
    page: options.page || 1,
    limit: options.limit || 10,
    sortBy: options.sortBy || "createdAt",
    sortOrder: options.sortOrder || "desc",
  };

  const response = await axiosInstance.get("/products/search/advanced", {
    params,
  });

  return response.data;
}

// Get products by branch
export async function getProductsByBranch(
  branchId: string,
  filters: {
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    operationType?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
  },
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) {
  const params = {
    ...filters,
    page: options.page || 1,
    limit: options.limit || 10,
    sortBy: options.sortBy || "createdAt",
    sortOrder: options.sortOrder || "desc",
  };

  const response = await axiosInstance.get(`/products/branch/${branchId}`, {
    params,
  });

  return response.data;
}

// Get a single product by ID
export async function getProductById(id: string) {
  const response = await axiosInstance.get(`/products/${id}`);

  return response.data;
}

// Update a product
export async function updateProduct(id: string, data: Partial<TProduct>) {
  const response = await axiosInstance.patch(`/products/${id}`, data);

  return response.data;
}

// Delete a product
export async function deleteProduct(id: string) {
  const response = await axiosInstance.delete(`/products/${id}`);

  return response.data;
}

// Update stock for a specific branch
export async function updateStock(id: string, branchId: string, stock: number) {
  const response = await axiosInstance.patch(`/products/${id}/update-stock`, {
    branchId,
    stock,
  });

  return response.data;
}

// Apply discount
export async function applyDiscount(id: string, discount: TDiscount) {
  const response = await axiosInstance.post(
    `/products/${id}/apply-discount`,
    discount
  );

  return response.data;
}

// Remove discount
export async function removeDiscount(id: string) {
  const response = await axiosInstance.delete(
    `/products/${id}/remove-discount`
  );

  return response.data;
}

// Get main categories
export async function getMainCategories() {
  const response = await axiosInstance.get("/products/categories/main");

  return response.data;
}

// Get sub-categories
export async function getSubCategories(category?: string) {
  const params = category ? { category } : {};
  const response = await axiosInstance.get("/products/categories/sub", {
    params,
  });

  return response.data;
}
