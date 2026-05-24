"use server";

import axiosInstance from "@/src/lib/axios";
import { IUser } from "@/src/types";

export const getAllUsers = async (queryParams?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams();

    if (queryParams?.page) params.append("page", queryParams.page.toString());
    if (queryParams?.limit)
      params.append("limit", queryParams.limit.toString());
    if (queryParams?.search) params.append("search", queryParams.search);

    const response = await axiosInstance.get(`/user?${params.toString()}`);

    return response.data;
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to fetch users");
    throw new Error(message);
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/user/${id}`);

    return data;
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to fetch user");
    throw new Error(message);
  }
};


export const updateUser = async (id: string, userData: Partial<IUser>) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}`, userData);

    return data;
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to update user");
    throw new Error(message);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/user/${id}`);

    return data;
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to delete user");
    throw new Error(message);
  }
};

export const updateUserStatus = async (id: string, status: string) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}/status`, {
      status,
    });

    return data;
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to update status");
    throw new Error(message);
  }
};

export const updateUserRole = async (id: string, role: string) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${id}/role`, { role });

    return data;
  } catch (error) {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error instanceof Error ? error.message : "Failed to update role");
    throw new Error(message);
  }
};
