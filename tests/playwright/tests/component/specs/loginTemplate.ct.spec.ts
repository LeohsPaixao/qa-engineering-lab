import { expect, test } from '@playwright/test';

const loginEndpoint = '**/auth/login';

test.describe('LoginTemplate', () => {
  test('exibe os campos do formulário de login', async ({ mount }) => {
    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await expect(component.getByTestId('form-login')).toBeVisible();
    await expect(component.getByTestId('input-email')).toBeVisible();
    await expect(component.getByTestId('input-password')).toBeVisible();
    await expect(component.getByTestId('btn-login')).toHaveText('Entrar na Conta');
  });

  test('exibe mensagens de validação ao enviar o formulário vazio', async ({ mount }) => {
    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await component.getByTestId('btn-login').click();

    await expect(component.getByTestId('message-error-email')).toHaveText('O Email é obrigatório.');
    await expect(component.getByTestId('message-error-password')).toHaveText('A Senha é obrigatória.');
  });

  test('exibe mensagem de validação para e-mail inválido', async ({ mount }) => {
    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await component.getByTestId('input-email').fill('email-invalido');
    await component.getByTestId('input-password').fill('123456');
    await component.getByTestId('btn-login').click();

    await expect(component.getByTestId('message-error-email')).toHaveText('Email inválido.');
    await expect(component.getByTestId('message-error-password')).toBeHidden();
  });

  test('envia as credenciais e exibe o toast de sucesso', async ({ page, mount }) => {
    let requestBody: { email?: string; password?: string } | null = null;

    await page.route(loginEndpoint, async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-token', message: 'Login realizado com sucesso!' }),
      });
    });

    const component = await mount('modules/auth/components/login/LoginTemplate/Default');

    await component.getByTestId('input-email').fill('generic@example.com');
    await component.getByTestId('input-password').fill('123456');
    await component.getByTestId('btn-login').click();

    await expect(page.getByText('Login realizado com sucesso!')).toBeVisible();
    expect(requestBody).toEqual({ email: 'generic@example.com', password: '123456' });
  });
});
