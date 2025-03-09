import { z } from 'zod';

// Zod schema for the login form
export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .min(1, "Email is required"),

  password: z.string()
    .min(6, "Password must be at least 6 characters")
});




function isStrongPassword(password: string): boolean {
  const passwordLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return passwordLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

// Password strength message based on the password
function passwordStrengthMeter(password: string): string {
  if (password.length < 8) {
    return "Weak: Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return "Weak: Password must contain both uppercase and lowercase letters.";
  } else if (!/[0-9]/.test(password)) {
    return "Weak: Password must contain a number.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Weak: Password must contain a special character.";
  } else {
    return "Strong: Password meets the required criteria.";
  }
}


export const registrationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "Username cannot exceed 20 characters."),
  
  email: z
    .string()
    .email("Invalid email address."),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .refine((val) => isStrongPassword(val), {
      message: "Password must contain uppercase, lowercase, a number, and a special character.",
    }),
  
  confirmedPassword: z
    .string()
}).refine(
  (values) => values.password === values.confirmedPassword,
  {
    message: "Passwords must match",
    path: ["confirmedPassword"],
  }
);
