import { z } from 'zod';

/**
 * Valida um schema Zod.
 *
 * @param schema - O schema Zod a ser validado.
 * @param data - Os dados a serem validados.
 * @returns Os dados validados.
 * @throws Erro se os dados não forem validados.
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.parse(data);

  return result;
}