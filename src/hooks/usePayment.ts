import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  initPayment,
  getPaymentStatus,
  type TPaymentInit,
  type TPaymentStatus,
} from "@/src/services/PaymentService";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import type { TApiResponse } from "@/src/types";

const TERMINAL = new Set(["SUCCESS", "FAILED", "CANCELLED"]);

export const useInitPayment = () => {
  return useMutation<TApiResponse<TPaymentInit>, Error, string>({
    mutationFn: initPayment,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not start online payment."));
    },
  });
};

export const usePaymentStatus = (orderId: string | null) => {
  return useQuery<TApiResponse<TPaymentStatus>, Error>({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPaymentStatus(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;

      return status && TERMINAL.has(status) ? false : 2000;
    },
    refetchIntervalInBackground: false,
    retry: 3,
    staleTime: 0,
  });
};
