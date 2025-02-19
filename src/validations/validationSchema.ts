import { z } from "zod";

// Register Schema
export const registerValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  mobileNumber: z
    .string({
      required_error: "Mobile number is required",
    })
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number cannot exceed 15 digits"),
  profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),
});

// Login Schema
export const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

// Export types inferred from schemas
export type FormData = z.infer<typeof registerValidationSchema>;
