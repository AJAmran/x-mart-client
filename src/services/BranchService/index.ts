"use server";

import { BranchFilters, PaginationOptions, TBranch } from "@/src/interface/branch";
import axiosInstance from "@/src/lib/axios";


export async function createBranch(data: TBranch) {
  const response = await axiosInstance.post("/branches", data);

  return response.data;
}

export async function getAllBranches(
  filters: BranchFilters = {},
  options: PaginationOptions = {}
) {
  const params = {
    ...filters,
    page: options.page || 1,
    limit: options.limit || 10,
    sortBy: options.sortBy || "createdAt",
    sortOrder: options.sortOrder || "desc",
  };

  const response = await axiosInstance.get("/branches", { params });

  return response.data;
}

export async function getBranchById(id: string) {
  const response = await axiosInstance.get(`/branches/${id}`);

  return response.data;
}

export async function updateBranch(id: string, data: Partial<TBranch>) {
  const response = await axiosInstance.patch(`/branches/${id}`, data);

  return response.data;
}

export async function deleteBranch(id: string) {
  const response = await axiosInstance.delete(`/branches/${id}`);

  return response.data;
}

export async function getNearbyBranches(
  lat: number,
  lng: number,
  maxDistance: number,
  limit: number = 5
) {
  const response = await axiosInstance.get("/branches/nearby/locations", {
    params: { lat, lng, maxDistance, limit },
  });

  return response.data;
}