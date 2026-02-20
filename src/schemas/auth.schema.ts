import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Create User Schema
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().min(1, "Display name is required").max(100),
  photoUrl: z.string().url("Invalid photo URL").optional(),
  role: z.enum(["super_admin", "admin", "editor", "viewer"]),
  permissions: z.array(z.string()),
  active: z.boolean().default(true),
});

// Update User Schema
export const updateUserSchema = createUserSchema.partial();

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
