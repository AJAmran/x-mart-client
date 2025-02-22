import { z } from "zod";

// Register Schema
export const registerValidationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .regex(/^\d{10,15}$/, "Mobile number must be 10-15 digits"),
  profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),
});

// Login Schema
export const loginValidationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

// Export types inferred from schemas
export type RegisterFormData = z.infer<typeof registerValidationSchema>;
export type LoginFormData = z.infer<typeof loginValidationSchema>;
