import { z } from "zod";

// Reusable discount schema
export const discountSchema = z.object({
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0, "Discount value must be a positive number"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Product schema
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  stock: z.number().min(0, "Stock must be a positive number"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  discount: discountSchema.optional(),
});

// Schema for updating a product
export const updateProductSchema = productSchema.partial();
