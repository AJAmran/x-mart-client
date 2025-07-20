import { z } from "zod";
import { DAYS_OF_WEEK } from "../constant/branch";

const contactSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  manager: z.string().optional(),
  emergencyContact: z.string().optional(),
});

const coordinatesSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  coordinates: coordinatesSchema.optional(),
});

const operatingHoursSchema = z.object({
  day: z.enum(DAYS_OF_WEEK),
  openingTime: z.string().min(1, "Opening time is required"),
  closingTime: z.string().min(1, "Closing time is required"),
  isClosed: z.boolean().optional(),
});

export const branchFormSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  code: z.string().min(1, "Branch code is required"),
  status: z.enum(["active", "inactive", "maintenance"]).optional(),
  contact: contactSchema,
  location: locationSchema,
  operatingHours: z
    .array(operatingHoursSchema)
    .min(1, "At least one operating day is required"),
  openingDate: z.coerce.date(),
  size: z.number().min(0).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;
