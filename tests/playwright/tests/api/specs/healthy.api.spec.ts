import { expect, test } from '@playwright/test';
import { healthySchema } from '../schemas/healthy.schema';
import { validateSchema } from '../shared/validateSchema';

test.describe('API de Saúde', {
  annotation: { type: 'api', description: 'Teste de API de saúde' },
}, () => {

  test('Deveria ser possível verificar saúde', async ({ request }) => {
    const response = await request.get('/healthy');

    const responseJson = await response.json();
    const parsed = validateSchema(healthySchema, responseJson);

    expect(response.status()).toBe(200);
    expect(parsed.status).toBe('healthy');
    expect(parsed.message).toBe('Sistema saudável');
  });
});