import { APIRequestContext, expect } from '@playwright/test';
import { loginRequestSchema, loginResponseSchema } from '../schemas/login.schema';
import { validateSchema } from './validateSchema';


/**
 * Realiza login na API
 * @param request - Request da API
 * @returns Token de autenticação
 */
export async function login(request: APIRequestContext): Promise<string> {
  const loginRequest = loginRequestSchema.parse({
    email: 'generic@example.com',
    password: '123456',
  });

  const response = await request.post('/auth/login', {
    data: loginRequest,
  });

  const responseJson = await response.json();

  const parsed = validateSchema(loginResponseSchema, responseJson);
  expect(response.status()).toBe(200);
  expect(parsed.message).toBe('Login realizado com sucesso!');
  expect(parsed.token).toMatch(/^ey/);

  return parsed.token;
}