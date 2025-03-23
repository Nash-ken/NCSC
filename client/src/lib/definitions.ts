import { z } from 'zod';

// Define the login schema
export const loginSchema = z.object({
    email: z.string()
      .email("Invalid email format")
      .min(1, "Email is required"),
  
    password: z.string()
      .min(6, "Password must be at least 6 characters"),
    stay: z.coerce.boolean().optional().default(false)
  });

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    ConfirmPassword: z
      .string(),
  })
  .refine((data) => data.password === data.ConfirmPassword, {
    path: ["ConfirmPassword"],
    message: "Passwords do not match",
  })
