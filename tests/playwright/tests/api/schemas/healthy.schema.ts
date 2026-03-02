import { z } from 'zod';

export const healthySchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  message: z.string(),
});