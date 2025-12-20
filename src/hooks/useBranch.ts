// src/hooks/useBranch.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";
import * as branchService from "@/src/services/BranchService";
import {
  TBranch,
  BranchFilters,
  PaginationOptions,
} from "@/src/interface/branch";

export const useBranches = (
  filters: BranchFilters = {},
  options: PaginationOptions = {}
) => {
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  return useQuery({
    queryKey: ["branches", stableFilters, stableOptions],
    queryFn: () => branchService.getAllBranches(stableFilters, stableOptions),
    placeholderData: (prev) => prev,
  });
};

export const useBranchById = (id?: string) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () => (id ? branchService.getBranchById(id) : null),
    enabled: !!id,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TBranch> }) =>
      branchService.updateBranch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branch", variables.id] });
      toast.success("Branch updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useNearbyBranches = (
  lat?: number,
  lng?: number,
  maxDistance?: number,
  limit?: number
) => {
  return useQuery({
    queryKey: ["branches", "nearby", lat, lng, maxDistance],
    queryFn: () => {
      if (lat && lng && maxDistance) {
        return branchService.getNearbyBranches(lat, lng, maxDistance, limit);
      }

      return null;
    },
    enabled: !!lat && !!lng && !!maxDistance,
  });
};
