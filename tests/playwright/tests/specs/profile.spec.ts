import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { login } from '../shared/commands/login';

test.describe('Tela de Perfil', {
  annotation: { type: 'Test', description: 'Teste de perfil' },
}, () => {

  test.beforeEach(async ({ page }) => {
    login(page, 'generic@example.com', '123456');
    await page.goto('/profile');
    await page.waitForURL('/profile');
  });

  test('Deveria ser possível visualizar os elementos da tela de Perfil', async ({ page }) => {
    await expect(page.locator('[data-testid="form-profile"]')).toBeVisible();
    await expect(page.locator('.form-group').first()).toBeVisible();
    await expect(page.locator('[data-testid="btn-save-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-save-profile"]')).toBeEnabled();
  });

  test('Não deveria ser possível salvar a alteração sem colocar algum dado no Nome Completo', async ({ page }) => {
    await page.locator('[data-testid="input-fullname-profile"]').clear();
    await page.locator('[data-testid="input-fullname-profile"]').blur();
    await expect(page.locator('[data-testid="input-error-fulname-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-fulname-profile"]')).toHaveText('O Nome Completo é obrigatório.');
  });

  test('Não deveria ser possível salvar a alteração com apenas o nome', async ({ page }) => {
    await page.locator('[data-testid="input-fullname-profile"]').fill('testname');
    await page.locator('[data-testid="input-fullname-profile"]').blur();
    await expect(page.locator('[data-testid="input-error-fulname-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-fulname-profile"]')).toHaveText('O Nome Completo deve conter pelo menos Nome e Sobrenome.');
  });

  test('Não deveria ser possível salvar a alteração com letras no telefone', async ({ page }) => {
    await page.locator('[data-testid="input-phone-profile"]').fill('testphone');
    await page.locator('[data-testid="input-phone-profile"]').blur();
    await expect(page.locator('[data-testid="input-error-phone-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-phone-profile"]')).toHaveText('O telefone deve conter apenas números.');
  });

  test('Não deveria ser possível salvar a alteração com mais de 11 dígitos no telefone', async ({ page }) => {
    await page.locator('[data-testid="input-phone-profile"]').fill('1452145214521452');
    await page.locator('[data-testid="input-phone-profile"]').blur();
    await expect(page.locator('[data-testid="input-error-phone-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-phone-profile"]')).toHaveText('O telefone deve ter no máximo 11 dígitos.');
  });

  test('Não deveria ser possível salvar a alteração com menos de 10 dígitos no telefone', async ({ page }) => {
    await page.locator('[data-testid="input-phone-profile"]').fill('1452');
    await page.locator('[data-testid="input-phone-profile"]').blur();
    await expect(page.locator('[data-testid="input-error-phone-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-phone-profile"]')).toHaveText('O telefone deve ter no mínimo 10 dígitos.');
  });

  test('Deveria ser possível salvar a alteração', async ({ page }) => {
    const fullName = faker.person.fullName();
    const phone = faker.phone.number({ style: 'national' });
    const socialName = faker.person.firstName();

    await page.locator('[data-testid="input-fullname-profile"]').fill(fullName);
    await page.locator('[data-testid="input-phone-profile"]').fill(phone);
    await page.locator('[data-testid="input-socialname-profile"]').fill(socialName);
    await page.locator('[data-testid="btn-save-profile"]').click();
    await expect(page.locator('[data-testid="toast-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="toast-content"]')).toHaveText('Usuário alterado com sucesso!');
  });
});
