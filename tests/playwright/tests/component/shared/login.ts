import { Page } from '@playwright/test';

/**
 * Realiza o mock da requisição POST para o endpoint /auth/login, retornando um status 200 e um corpo com o token e mensagem de sucesso.
 * @param page - A instância da página do Playwright onde o mock será aplicado.
 * @returns Objeto com a propriedade requestBody que será preenchida quando a requisição for feita.
 */
export async function mockLogin(page: Page): Promise<{ value: {email?: string; password?: string } | null } > {
  const requestBody = { value: { email: undefined, password: undefined } };

  await page.route('**/auth/login', async (route) => {
    requestBody.value = route.request().postDataJSON();
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-token', message: 'Login realizado com sucesso!' }),
    });
  });

  return requestBody;
};