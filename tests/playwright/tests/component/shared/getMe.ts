import { Page } from '@playwright/test';

/**
 * Realiza o mock da requisição GET para o endpoint /users/me, retornando um status 200 e um corpo vazio.
 * @param page - A instância da página do Playwright onde o mock será aplicado.
 */
export async function mockGetMe(page: Page) {
  await page.route('**/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
}