import { z } from "zod";
import { PRODUCT_CATEGORY, PRODUCT_STATUS, PRODUCT_AVAILABILITY, PRODUCT_OPERATION_TYPES } from "@/src/types";

// Reusable schemas
const inventorySchema = z.object({
  stock: z.number().min(0, "Stock must be a positive number"),
  lowStockThreshold: z.number().min(0).optional(),
  branchId: z.string().min(1, "Branch ID is required"),
});

const discountSchema = z.object({
  type: z.enum(["percentage", "fixed"], {
    required_error: "Discount type is required",
  }),
  value: z.number().min(0, "Discount value must be positive"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  applicableBranches: z.array(z.string()).optional(),
});

const dimensionsSchema = z.object({
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
});

// Main product schema
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  costPrice: z.number().min(0).optional(),
  category: z.enum(
    Object.keys(PRODUCT_CATEGORY) as [keyof typeof PRODUCT_CATEGORY],
    { required_error: "Category is required" }
  ),
  subCategory: z.string().optional(),
  status: z
    .enum(Object.keys(PRODUCT_STATUS) as [keyof typeof PRODUCT_STATUS])
    .optional(),
  inventories: z.array(inventorySchema).min(1, "At least one inventory entry is required"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  discount: discountSchema.optional(),
  availability: z
    .enum(Object.keys(PRODUCT_AVAILABILITY) as [keyof typeof PRODUCT_AVAILABILITY],
    { required_error: "Availability is required" }
  ),
  availableBranches: z.array(z.string()).optional(),
  operationType: z
    .enum(Object.keys(PRODUCT_OPERATION_TYPES) as [keyof typeof PRODUCT_OPERATION_TYPES])
    .optional(),
  tags: z.array(z.string()).optional(),
  weight: z.number().min(0).optional(),
  dimensions: dimensionsSchema.optional(),
  manufacturer: z.string().optional(),
  supplier: z.string().optional(),
  barcode: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
});

export const updateProductSchema = productSchema.partial();

export const stockUpdateSchema = z.object({
  branchId: z.string().min(1, "Branch ID is required"),
  stock: z.number().min(0, "Stock must be positive"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductUpdateFormValues = z.infer<typeof updateProductSchema>;
export type StockUpdateFormValues = z.infer<typeof stockUpdateSchema>;