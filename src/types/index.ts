import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
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
