import { expect, test } from '@playwright/test';
import { loginErrorResponseSchema, loginRequestSchema, loginResponseSchema } from '../schemas/login.schema';
import { validateSchema } from '../shared/validateSchema';

test.describe('API de Login', {
  annotation: { type: 'api', description: 'Teste de API de login' },
}, () => {

  test('Deveria ser possível fazer login com credenciais válidas', async ({ request }) => {
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
  });

  test('Não deveria ser possível fazer login com credenciais inválidas', async ({ request }) => {
    const loginRequest = loginRequestSchema.parse({
      email: 'email@example.com',
      password: 'password@example.com',
    });

    const response = await request.post('/auth/login', {
      data: loginRequest,
    });

    const responseJson = await response.json();

    const parsed = validateSchema(loginErrorResponseSchema, responseJson);
    expect(response.status()).toBe(404);
    expect(parsed.message).toBe('Usuário não encontrado.');
    expect(parsed.error).toBe('Not Found');
    expect(parsed.statusCode).toBe(404);
  });

  test('Não deveria ser possível fazer login com senha inválida', async ({ request }) => {
    const loginRequest = loginRequestSchema.parse({
      email: 'generic@example.com',
      password: 'password@example.com',
    });

    const response = await request.post('/auth/login', {
      data: loginRequest,
    });

    const responseJson = await response.json();

    const parsed = validateSchema(loginErrorResponseSchema, responseJson);
    expect(response.status()).toBe(401);
    expect(parsed.message).toBe('A senha não confere.');
    expect(parsed.error).toBe('Unauthorized');
    expect(parsed.statusCode).toBe(401);
  });
});
