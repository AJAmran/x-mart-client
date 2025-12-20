"use server";

import axiosInstance from "@/src/lib/axios";
import { TOrder } from "@/src/types";

// Create an order
export const createOrder = async (data: Partial<TOrder>) => {
  const response = await axiosInstance.post("/orders", data);

  return response.data;
};

// Get all orders with filters, sorting, and pagination (Admin)
export const getAllOrders = async (
  filters: {
    status?: string;
    userId?: string;
  },
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) => {
  const params = {
    ...filters,
    status: filters.status?.toUpperCase(),
    page: options.page || 1,
    limit: options.limit || 10,
    sortBy: options.sortBy || "createdAt",
    sortOrder: options.sortOrder || "desc",
  };

  const response = await axiosInstance.get("/orders", { params });

  return response.data;
};

// Get a single order by ID
export const getOrderById = async (id: string) => {
  const response = await axiosInstance.get(`/orders/${id}`);

  return response.data;
};

// Get user's orders
export const getUserOrders = async () => {
  const response = await axiosInstance.get("/orders/my-orders");

  return response.data;
};

// Update order status (Admin)
export const updateOrderStatus = async (
  id: string,
  status: string,
  note?: string
) => {
  const response = await axiosInstance.patch(`/orders/${id}/status`, {
    status,
    note,
  });

  return response.data;
};

// Cancel an order (User)
export const cancelOrder = async (id: string) => {
  const response = await axiosInstance.patch(`/orders/${id}/cancel`);

  return response.data;
};