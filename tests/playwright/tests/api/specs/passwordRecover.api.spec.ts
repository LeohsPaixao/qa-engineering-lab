import { expect, test } from '@playwright/test';
import { passwordRecoverErrorResponseSchema, passwordRecoverRequestSchema, passwordRecoverResponseSchema } from '../schemas/passwordRecover.schema';
import { validateSchema } from '../shared/validateSchema';

test.describe('Password Recovery API', () => {
  test('Deve recuperar senha com sucesso', async ({ request }) => {
    const data = passwordRecoverRequestSchema.parse({
      email: "generic@example.com",
    });
    
    const response = await request.post('/password-recovery/forgot-password', {
      data: {
        email: data.email,
      },
    });

    const responseBody = await response.json();
    const parse = validateSchema(passwordRecoverResponseSchema, responseBody);

    expect(response.status()).toBe(200);
    expect(parse.message).toEqual("Um e-mail foi enviado com instruções para recuperar a senha.");

  });

  test('Deve retornar erro ao tentar recuperar senha com email inválido', async ({ request }) => {
    const data = passwordRecoverRequestSchema.parse({
      email: "generic-invalid@error.com",
    });
    
    const response = await request.post('/password-recovery/forgot-password', {
      data: {
        email: data.email,
      },
    });

    const responseBody = await response.json();
    const parse = validateSchema(passwordRecoverErrorResponseSchema, responseBody);

    expect(response.status()).toBe(404);
    expect(parse.message).toEqual("Usuário não encontrado.");
    expect(parse.error).toEqual('Not Found');
    expect(parse.statusCode).toEqual(404);
  });
});
