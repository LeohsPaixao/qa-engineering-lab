import { z } from 'zod';

export const loginResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
});

export const loginErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
});

export const loginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});