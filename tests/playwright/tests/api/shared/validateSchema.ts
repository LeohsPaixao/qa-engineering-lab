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
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(`Falha na validação do schema: ${result.error.message}`);
  }

  return result.data;
}