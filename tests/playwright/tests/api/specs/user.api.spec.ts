import test, { expect } from '@playwright/test';
import { userMeErrorSchema, userSchema } from '../schemas/users.schema';
import { login } from '../shared/login';
import { validateSchema } from '../shared/validateSchema';

test.describe('API de Usuário', { annotation: { type: 'api', description: 'Teste de API de usuário' } }, () => {
  test.describe('GET /users/me', { annotation: { type: 'get', description: "Testes de GET com o endpoint /users/me" } }, () => {
    test('Deve retornar os dados do usuário logado', async ({ request }) => {
      const token = await login(request);
      const response = await request.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = await response.json()
      const parse = validateSchema(userSchema, responseJson);

      expect(response.status()).toBe(200);
      expect(parse).toMatchObject({
        id: expect.any(Number),
        full_name: expect.any(String),
        social_name: expect.any(String),
        email: expect.any(String),
        document: expect.any(String),
        phone: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    test('Deve retornar erro 401 quando não estiver logado', async ({ request }) => {
      const response = await request.get('/users/me');
      const responseJson = await response.json()
      const parse = validateSchema(userMeErrorSchema, responseJson);

      expect(response.status()).toBe(401);
      expect(parse).toMatchObject({
        message: 'Unauthorized',
      });
    });
  });

  test.describe('GET /users', { annotation: { type: 'get', description: "Testes de GET com o endpoint /users" } }, () => {
  });

  test.describe('POST /users', { annotation: { type: 'post', description: "Testes de POST com o endpoint /users" } }, () => {
  });

  test.describe('PATCH /users', { annotation: { type: 'patch', description: "Testes de PATCH com o endpoint /users" } }, () => {
  });

  test.describe('DELETE /users', { annotation: { type: 'delete', description: "Testes de DELETE com o endpoint /users" } }, () => {
  });
});