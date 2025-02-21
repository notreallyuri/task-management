import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(4, "Username must be at least 4 characters long"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(8, "Username must be at least 8 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const updateUserSchema = z.object({
  email: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type UserType = z.infer<typeof userSchema>;
export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export type LoginData = z.infer<typeof loginSchema>;
