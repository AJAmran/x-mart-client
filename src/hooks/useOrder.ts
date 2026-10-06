import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
} from "@/src/services/OrderService";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import type { TApiResponse, TOrder } from "@/src/types";

// Fetch all orders (Admin)
export const useOrders = (
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
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  return useQuery<TApiResponse<TOrder[]>, Error>({
    queryKey: ["orders", stableFilters, stableOptions],
    queryFn: () => getAllOrders(stableFilters, stableOptions),
  });
};


export type TApiResult<T> = Omit<TApiResponse<T>, "meta">;

// Fetch a single order by ID
export const useOrderById = (id: string) => {
  return useQuery<TApiResult<TOrder>, Error>({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

// Fetch user's orders
export const useUserOrders = () => {
  return useQuery<TApiResult<TOrder[]>, Error>({
    queryKey: ["userOrders"],
    queryFn: () => getUserOrders(),
  });
};

// Create an order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<TApiResult<TOrder>, Error, Partial<TOrder>>({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create the order."));
    },
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      updateOrderStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not update order status."));
    },
  });
};

// Cancel an order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      toast.success("Order cancelled successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not cancel the order."));
    },
  });
};
