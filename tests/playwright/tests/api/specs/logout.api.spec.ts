import { expect, test } from '@playwright/test';


test.describe('API de Logout', {
  annotation: { type: 'api', description: 'Teste de API de logout' },
}, () => {

  test('Deveria ser possível fazer logout', async ({ request }) => {
    const response = await request.post('/auth/logout');
    expect(response.status()).toBe(200);
  });
});
