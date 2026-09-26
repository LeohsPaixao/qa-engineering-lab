import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  social_name: z.string().optional().nullable(),
  email: z.string(),
  document: z.string(),
  phone: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userCreateSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const userListSchema = z.object({
  users: z.array(userSchema),
});

export const userMeErrorSchema = z.object({
  message: z.string(),
});

export const userCreateErrorSchema = z.object({
  message: z.array(z.string()),
  error: z.string(),
  statusCode: z.number(),
});

export const userCreateConflictErrorSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
});

export const userUpdateSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const userDeleteSchema = z.object({
  message: z.string(),
});

export const userDeleteErrorSchema = z.object({
  message: z.array(z.string()),
  error: z.string(),
  statusCode: z.number(),
});

export const userDeleteIDInvalidSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
});