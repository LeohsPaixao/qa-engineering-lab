import { z } from "zod";

export const passwordRecoverRequestSchema = z.object({
  email: z.string(),
});

export const passwordRecoverResponseSchema = z.object({
  message: z.string(),
});

export const passwordRecoverErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number(),
});
