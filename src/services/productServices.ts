import api from "../lib/axios";

export type TProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  stock: number;
  images: string[];
  discount?: {
    type: string;
    value: number;
    startDate?: string;
    endDate?: string;
  };
};

export const getProducts = async (filters: any, options: any) => {
  const response = await api.get("/products", { params: { ...filters, ...options } });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: Omit<TProduct, "_id">) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<TProduct>) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};