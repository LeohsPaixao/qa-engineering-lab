import { expect, test } from '@playwright/test';

const userEndpoint = '**/users/me';

test.describe('AppHeader', () => {
  test('exibe o nome do usuário recebido por prop', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await expect(component.getByTestId('user-name')).toHaveText('Maria QA');
    await expect(component.getByTestId('link-home')).toHaveAttribute('href', '/home');
    await expect(component.getByTestId('link-table-users')).toHaveAttribute('href', '/listusers');
  });

  test('usa o nome padrão quando não há usuário', async ({ page, mount }) => {
    await page.route(userEndpoint, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));

    const component = await mount('components/AppHeader/WithoutUser');

    await expect(component.getByTestId('user-name')).toHaveText('Usuário');
  });

  test('abre e fecha o menu do usuário ao clicar no avatar', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await expect(component.getByTestId('dropdown-profile')).toBeHidden();

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile')).toBeVisible();

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile')).toBeHidden();
  });

  test('fecha o menu ao clicar fora dele', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile')).toBeVisible();

    await component.locator('header').click({ position: { x: 5, y: 5 } });
    await expect(component.getByTestId('dropdown-profile')).toBeHidden();
  });

  test('navega para o perfil ao clicar em Perfil', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await component.getByTestId('user-dropdown').click();
    await component.getByTestId('dropdown-profile-update').click();

    await expect(component.getByTestId('current-route')).toHaveValue('/profile');
  });
});
