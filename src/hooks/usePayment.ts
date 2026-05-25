import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { initPayment, getPaymentStatus } from "@/src/services/PaymentService";

export const useInitPayment = () => {
  return useMutation({
    mutationFn: initPayment,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const usePaymentStatus = (orderId: string | null) => {
  return useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => getPaymentStatus(orderId!),
    enabled: !!orderId,
    refetchInterval: 2000,
    retry: 5,
  });
};
