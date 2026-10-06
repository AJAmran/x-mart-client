"use server";

import axiosInstance, { type TEnvelope } from "@/src/lib/serverAxios";

/** Gateway session returned by `/payment/init`. */
export type TPaymentInit = {
  GatewayPageURL: string;
  TransactionId?: string;
};

export const initPayment = async (orderId: string) => {
  const response = await axiosInstance.post<TEnvelope<TPaymentInit>>(
    "/payment/init",
    { orderId }
  );

  return response.data;
};

/** Gateway session returned by `/payment/init`. */
export type TPaymentStatus = { status: string };

export const getPaymentStatus = async (orderId: string) => {
  const response = await axiosInstance.get<TEnvelope<TPaymentStatus>>(
    `/payment/status/${orderId}`
  );

  return response.data;
};