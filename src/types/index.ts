import { SVGProps } from "react";
import { PRODUCT_AVAILABILITY, PRODUCT_CATEGORY, PRODUCT_OPERATION_TYPES, PRODUCT_STATUS } from "../constants";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IUser {
  _id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  mobileNumber: string;
  profilePhoto: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type TDiscount = {
  type: "percentage" | "fixed";
  value: number;
  startDate?: Date;
  endDate?: Date;
  applicableBranches?: string[];
};

export type TInventory = {
  stock: number;
  lowStockThreshold: number;
  branchId: string;
};

export type TProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  category: keyof typeof PRODUCT_CATEGORY;
  subCategory?: string;
  status: keyof typeof PRODUCT_STATUS;
  stock?: number;
  inventories: TInventory[];
  images: string[];
  discount?: TDiscount;
  availability: keyof typeof PRODUCT_AVAILABILITY;
  availableBranches?: string[];
  operationType: keyof typeof PRODUCT_OPERATION_TYPES;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  manufacturer?: string;
  supplier?: string;
  barcode?: string;
  sku: string;
  createdAt?: Date;
  updatedAt?: Date;
};


export type ProductFilters = {
  searchTerm?: string;
  category?: string;
  status?: keyof typeof PRODUCT_STATUS;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
};

export type ProductOptions = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
};


export interface Variant {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
}

export interface Option {
  id: string;
  name: string;
  options: string[];
  price?: number;
}


export type TCartItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  stock?: number;
};

export type TCart = {
  items: TCartItem[];
  totalPrice: number;
  totalItems: number;
};

export type TWishlistItem = {
  productId: string;
  price: number;
  name: string;
  image: string;
  stock?: number;
  addedAt: string;
};

export type TWishlist = {
  items: TWishlistItem[];
  totalItems: number;
};

export interface TShippingInfo {
  name: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  division: string;
  phone: string;
}

export type UsersResponse = {
  data: IUser[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export enum ORDER_STATUS {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export type TOrderItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
};


export type TOrder = {
  _id: string;
  userId: string;
  items: TOrderItem[];
  shippingInfo: TShippingInfo;
  totalPrice: number;
  status: keyof typeof ORDER_STATUS;
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE";
  createdAt: string;
  updatedAt: string;
  trackingHistory: {
    status: keyof typeof ORDER_STATUS;
    updatedAt: string;
    note?: string;
  }[];
};


/* -- API envelope ----------------------------------------------------------
 *
 * Every list endpoint returns this shape:
 *   { success, message, data: T[], meta: { page, limit, total, totalPages } }
 *
 * The service layer returns the envelope verbatim (`response.data`), so the
 * query hooks are parameterised on `TApiResponse<T>` below. Before this existed
 * the hooks were bare `useQuery(...)`, which infers `data` as `{}` and makes
 * `data.data` / `data.meta` fail to type-check at every call site.
 */

export type TPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: TPaginationMeta;
};

export type TApiFailure = {
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
};
