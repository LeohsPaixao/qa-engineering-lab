import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  social_name: z.string().nullable(),
  email: z.string(),
  document: z.string(),
  phone: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userListSchema = z.array(userSchema);

export const userMeErrorSchema = z.object({
  message: z.string(),
});
