import { expect, test } from '@playwright/test';
import { login } from '../shared/commands/login';
import { generateUsers } from '../shared/mocks/generateUsers';

test.describe('Tela de listagem de Usuários', {
  annotation: { type: 'Test', description: 'Teste de listagem de usuários' },
}, () => {
  test.beforeAll(async () => {
    await generateUsers();
  });

  test.beforeEach(async ({ page }) => {
    await login(page, 'generic@example.com', '123456');
    await page.goto('/listusers', { waitUntil: 'load' });
  });

  test('Deveria ser possível visualizar os elementos da tela de listagem de Usuários', async ({ page }) => {
    await expect(page.locator('[data-testid="table-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkbox-select-all"]')).toBeVisible();
    await page.locator('[data-testid="btn-delete-user"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-testid="btn-delete-user"]')).toBeVisible();
  });

  test('Deveria ser possível selecionar todos os usuários', async ({ page }) => {
    const selectAllCheckbox = page.locator('[data-testid="checkbox-select-all"]');
    await selectAllCheckbox.check();
    await expect(selectAllCheckbox).toBeChecked();
  });

  test('Deveria ser possível selecionar um usuário e excluí-lo', async ({ page }) => {
    const userCheckbox = page.locator('[data-testid="checkbox-select-users"]').nth(2);
    await userCheckbox.check();
    const deleteButton = page.locator('[data-testid="btn-delete-user"]');
    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.click();
    const toastContent = page.locator('[data-testid="toast-content"]').first();
    await expect(toastContent).toBeVisible();
    await expect(toastContent).toHaveText('1 usuário(s) excluído(s) com sucesso!');
  });
});
