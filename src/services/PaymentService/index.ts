"use server";

import axiosInstance from "@/src/lib/axios";

export const initPayment = async (orderId: string) => {
  const response = await axiosInstance.post("/payment/init", { orderId });
  return response.data;
};

export const getPaymentStatus = async (orderId: string) => {
  const response = await axiosInstance.get(`/payment/status/${orderId}`);
  return response.data;
};
