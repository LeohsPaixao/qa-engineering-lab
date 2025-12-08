import { expect, test } from '@playwright/test';

test.describe('Tela de Recuperação de Senha', {
  annotation: { type: 'Test', description: 'Teste de recuperação de senha' },
}, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/recover-password');
  });

  test('Deveria ser possível visualizar os elementos da tela de Recuperação de Senha', async ({ page }) => {
    await expect(page.locator('[data-testid="form-recover-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-email-recover-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-recover-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="link-go-to-login"]')).toBeVisible();
  });

  test('Não deveria ser possível aparecer o toast de feedback para usuário apenas clicando no botão', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-recover-password"]')).toBeEnabled();
    await page.locator('[data-testid="btn-recover-password"]').click();
    await expect(page.locator('[data-testid="toast-content"]')).toBeHidden();
  });

  test('Deveria ser possível aparecer um toast de feedback caso coloque um email inválido', async ({ page }) => {
    await page.locator('[data-testid="input-email-recover-password"]').fill('email@example.com');
    await expect(page.locator('[data-testid="btn-recover-password"]')).toBeEnabled();
    await page.locator('[data-testid="btn-recover-password"]').click();
    await expect(page.locator('[data-testid="toast-content"]')).toHaveText('Usuário não encontrado.');
  });

  test('Deveria ser possível enviar o email de recuperação de senha', async ({ page }) => {
    await page.locator('[data-testid="input-email-recover-password"]').fill('generic@example.com');
    await expect(page.locator('[data-testid="btn-recover-password"]')).toBeEnabled();
    await page.locator('[data-testid="btn-recover-password"]').click();
    await expect(page.locator('[data-testid="toast-content"]')).toHaveText('Um e-mail foi enviado com instruções para recuperar a senha.');
  });

  test('Deveria ser possível voltar para a tela de login pelo link', async ({ page }) => {
    await page.locator('[data-testid="link-go-to-login"]').click();
    await expect(page.locator('[data-testid="form-login"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-login"]')).toBeVisible();
  });
});
