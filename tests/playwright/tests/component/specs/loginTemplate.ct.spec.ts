import { expect, test } from '@playwright/test';
import { mockLogin } from '../shared/login';

test.describe('LoginTemplate', () => {
  let requestBody: { value: { email?: string; password?: string } | null };

  test.beforeEach(async ({ page }) => {
    requestBody = await mockLogin(page);
    console.log('requestBody', requestBody);
  })

  test('Deveria ser possível exibir os campos do formulário de login', async ({ mount }) => {
    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await expect(component.getByTestId('form-login')).toBeVisible();
    await expect(component.getByTestId('input-email')).toBeVisible();
    await expect(component.getByTestId('input-password')).toBeVisible();
    await expect(component.getByTestId('btn-login')).toHaveText('Entrar na Conta');
  });

  test('Deveria ser possível exibir mensagens de validação ao enviar o formulário vazio', async ({ mount }) => {
    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await component.getByTestId('btn-login').click();

    await expect(component.getByTestId('message-error-email')).toHaveText('O Email é obrigatório.');
    await expect(component.getByTestId('message-error-password')).toHaveText('A Senha é obrigatória.');
  });

  test('Deveria ser possível exibir mensagem de validação para e-mail inválido', async ({ mount }) => {
    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await component.getByTestId('input-email').fill('email-invalido');
    await component.getByTestId('input-password').fill('123456');
    await component.getByTestId('btn-login').click();

    await expect(component.getByTestId('message-error-email')).toHaveText('Email inválido.');
    await expect(component.getByTestId('message-error-password')).toBeHidden();
  });

  test('Deveria ser possível enviar as credenciais e exibir o toast de sucesso', async ({ page, mount }) => {

    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await component.getByTestId('input-email').fill('generic@example.com');
    await component.getByTestId('input-password').fill('123456');
    await component.getByTestId('btn-login').click();

    await expect(page.getByText('Login realizado com sucesso!')).toBeVisible();
    expect(requestBody.value).toEqual({ email: 'generic@example.com', password: '123456' });
  });
});
