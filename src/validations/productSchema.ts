import { z } from "zod";

const discountSchema = z.object({
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  stock: z.number().min(0, "Stock must be a positive number"),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  discount: discountSchema.optional(),
});

export type TProductForm = z.infer<typeof productSchema>;
