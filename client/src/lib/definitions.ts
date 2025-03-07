import { z } from 'zod';

// Zod schema for the login form
export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email format") // Ensures the email is in the correct format
    .min(1, "Email is required"),  // Ensures email is provided

  password: z.string()
    .min(6, "Password must be at least 6 characters") // Minimum length for password
});
