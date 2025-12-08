import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { generateValidCPF } from '../shared/commands/generateValidCPF';

test.describe('Tela de Cadastro de Usuários', {
  annotation: { type: 'Test', description: 'Teste de cadastro de usuário' },
}, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('Deveria ser possivel visualizar os elementos da tela de cadastro', async ({ page }) => {
    await expect(page.locator('[data-testid="register-form"]')).toBeVisible();
    await expect(page.locator('.form-group').first()).toBeVisible();
    await expect(page.locator('[data-testid="btn-register"]')).toBeVisible();
    await expect(page.locator('[data-testid="link-go-to-login"]')).toBeVisible();
  });

  test('Não deveria ser possivel criar o usuário com o Nome Completo errado', async ({ page }) => {
    await page.locator('[data-testid="input-fullname"]').fill('Teste');
    await page.locator('[data-testid="input-fullname"]').blur();
    await expect(page.locator('[data-testid="input-error-fullname"]')).toHaveText('O Nome Completo deve conter pelo menos Nome e Sobrenome.');
  });

  test('Não deveria ser possivel criar o usuário com o CPF inválido', async ({ page }) => {
    await page.locator('[data-testid="input-document"]').fill('123.456.789-10');
    await page.locator('[data-testid="input-document"]').blur();
    await expect(page.locator('[data-testid="input-error-cpfcnpj"]')).toHaveText('CPF inválido.');
  });

  test('Não deveria ser possivel criar o usuário com o CNPJ inválido', async ({ page }) => {
    await page.locator('[data-testid="select-document-type"]').selectOption('cnpj');
    await page.locator('[data-testid="input-document"]').fill('12.456.789/1110-60');
    await page.locator('[data-testid="input-document"]').blur();
    await expect(page.locator('[data-testid="input-error-cpfcnpj"]')).toHaveText('CNPJ inválido.');
  });

  test('Não deveria ser possivel colocar letras no campo de telefone', async ({ page }) => {
    await page.locator('[data-testid="input-phone"]').fill('dfdfsff');
    await page.locator('[data-testid="input-phone"]').blur();
    await expect(page.locator('[data-testid="input-error-phone"]')).toHaveText('O telefone deve conter apenas números.');
  });

  test('Não deveria ser possivel colocar mais do que 11 dígitos no campo de telefone', async ({ page }) => {
    await page.locator('[data-testid="input-phone"]').fill('546521854651854');
    await page.locator('[data-testid="input-phone"]').blur();
    await expect(page.locator('[data-testid="input-error-phone"]')).toHaveText('O telefone deve ter no máximo 11 dígitos.');
  });

  test('Não deveria ser possivel colocar menos do que 10 dígitos no campo de telefone', async ({ page }) => {
    await page.locator('[data-testid="input-phone"]').fill('1452');
    await page.locator('[data-testid="input-phone"]').blur();
    await expect(page.locator('[data-testid="input-error-phone"]')).toHaveText('O telefone deve ter no mínimo 10 dígitos.');
  });

  test('Não deveria ser possivel criar o usuário com o email inválido', async ({ page }) => {
    await page.locator('[data-testid="input-email"]').fill('invalid-email');
    await page.locator('[data-testid="input-email"]').blur();
    await expect(page.locator('[data-testid="input-error-email"]')).toHaveText('Email inválido.');
  });

  test('Não deveria ser possivel criar o usuário com uma senha com menos de 6 caracteres', async ({ page }) => {
    await page.locator('[data-testid="input-password"]').fill('14521');
    await page.locator('[data-testid="input-password"]').blur();
    await expect(page.locator('[data-testid="input-error-password"]')).toHaveText('A Senha deve ter no mínimo 6 caracteres.');
  });

  test('Não deveria ser possivel criar o usuário com uma senha com mais de 20 caracteres', async ({ page }) => {
    await page.locator('[data-testid="input-password"]').fill('Teste54544dfdf545454d');
    await page.locator('[data-testid="input-password"]').blur();
    await expect(page.locator('[data-testid="input-error-password"]')).toHaveText('A Senha deve ter no máximo 20 caracteres.');
  });

  test('Deveria ser possível visualizar os erros embaixo dos inputs ao adicionar um valor e remover', async ({ page }) => {
    await page.locator('[data-testid="input-fullname"]').fill('Teste');
    await page.locator('[data-testid="input-document"]').fill('12345678901');
    await page.locator('[data-testid="input-email"]').fill('email@example.com');
    await page.locator('[data-testid="input-password"]').fill('123456');
    await page.locator('[data-testid="input-password-confirmation"]').fill('123456');

    await page.locator('[data-testid="input-fullname"]').clear();
    await page.locator('[data-testid="input-document"]').clear();
    await page.locator('[data-testid="input-email"]').clear();
    await page.locator('[data-testid="input-password"]').clear();
    await page.locator('[data-testid="input-password-confirmation"]').clear();

    await page.locator('[data-testid="input-password-confirmation"]').blur();

    await expect(page.locator('[data-testid="input-error-fullname"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-cpfcnpj"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-error-password-confirmation"]')).toBeVisible();
  });

  test('Deveria ser possível visualizar o erro de senha e senha de confirmação diferentes', async ({ page }) => {
    await page.locator('[data-testid="input-password"]').fill('123456');
    await page.locator('[data-testid="input-password-confirmation"]').fill('1234567');
    await page.locator('[data-testid="input-password-confirmation"]').blur();
    await expect(page.locator('[data-testid="input-error-password-confirmation"]')).toHaveText('As senhas não coincidem.');
  });

  test('Deveria ser possivel cadastrar um usuário', async ({ page }) => {
    const cpf = generateValidCPF();

    await page.locator('[data-testid="input-fullname"]').fill(faker.person.fullName({ lastName: 'Teste' }));
    await page.locator('[data-testid="input-socialname"]').fill(faker.person.middleName());
    await page.locator('[data-testid="input-document"]').fill(cpf);
    await page.locator('[data-testid="input-phone"]').fill(faker.phone.number({ style: 'national' }));
    await page.locator('[data-testid="input-email"]').fill(faker.internet.email({ provider: 'example.qa.solar' }));
    await page.locator('[data-testid="input-password"]').fill('123456');
    await page.locator('[data-testid="input-password-confirmation"]').fill('123456');
    await page.locator('[data-testid="btn-register"]').click();

    const toast = page.locator('[data-testid="toast-content"]');
    await toast.waitFor({ state: 'visible' });
    await expect(toast).toHaveText('Usuário criado com sucesso!');
  });

  test('Deveria ser possivel ir para a tela de login ao clicar no link', async ({ page }) => {
    await page.locator('[data-testid="link-go-to-login"]').click();
    await expect(page.locator('[data-testid="form-login"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-login"]')).toBeVisible();
  });
});
