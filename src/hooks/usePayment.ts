import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { initPayment, getPaymentStatus } from "@/src/services/PaymentService";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

const TERMINAL = new Set(["SUCCESS", "FAILED", "CANCELLED"]);

export const useInitPayment = () => {
  return useMutation({
    mutationFn: initPayment,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not start online payment."));
    },
  });
};

export const usePaymentStatus = (orderId: string | null) => {
  return useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPaymentStatus(orderId!),
    enabled: !!orderId,
    // High-priority fix: stop polling once the status is terminal. Without
    // this guard the query refires every 2s forever, hammering the backend
    // and keeping serverless functions warm.
    refetchInterval: (query) => {
      const status = (query.state.data as { data?: { status?: string } } | undefined)?.data?.status;

      return status && TERMINAL.has(status) ? false : 2000;
    },
    refetchIntervalInBackground: false,
    retry: 3,
    staleTime: 0,
  });
};
