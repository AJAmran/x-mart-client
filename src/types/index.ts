import { SVGProps } from "react";

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

export type TProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "ACTIVE" | "INACTIVE";
  stock: number;
  images: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    startDate?: Date;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

// types/Product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  subCategory?: string;
  brand?: string;
  sku?: string;
  discount?: number;
  inStock?: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
  variants?: Variant[];
  options?: Option[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

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

// interfaces/cartInterface.ts
export type TCartItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
};

export type TCart = {
  items: TCartItem[];
  totalPrice: number;
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