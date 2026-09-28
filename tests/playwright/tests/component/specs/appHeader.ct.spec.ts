import { expect, test } from '@playwright/test';
import { mockGetMe } from '../shared/getMe';

test.describe('AppHeader', () => {

  test.beforeEach(async ({ page }) => {
    await mockGetMe(page);
  });

  test('Deveria ser possivel visualizar os links de navegação', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await expect(component.getByTestId('link-home')).toHaveAttribute('href', '/home');
    await expect(component.getByTestId('link-table-users')).toHaveAttribute('href', '/listusers');
  });

  test('Deveria ser possivel visualizar o dropdown do usuário', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await expect(component.getByTestId('user-dropdown')).toBeVisible();
    await expect(component.getByTestId('user-avatar')).toBeVisible();
    await expect(component.getByTestId('user-name')).toHaveText('Teste Usuário');
  });

  test('Deveria ser possivel alternar o dropdown do usuário', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await expect(component.getByTestId('dropdown-profile')).toBeHidden();

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile')).toBeVisible();

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile')).toBeHidden();
  });

  test('Deveria ser possivel visualizar as opções do dropdown do usuário', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile-update')).toHaveText('Perfil');
    await expect(component.getByTestId('dropdown-profile-logout')).toHaveText('Sair');
  });

  test('Deveria ser possivel visualizar o efeito de hover nos itens do dropdown do usuário', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await component.getByTestId('user-dropdown').click();
    await component.getByTestId('dropdown-profile-update').hover();
    await expect(component.getByTestId('dropdown-profile-update')).toHaveCSS('background-color', 'rgb(248, 249, 250)');
  });

  test('Deveria ser possivel visualizar o estilo e o layout do header', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await expect(component.getByTestId('app-header')).toHaveCSS('display', 'flex');
    await expect(component.getByTestId('app-header')).toHaveCSS('justify-content', 'space-between');
    await expect(component.getByTestId('app-header')).toHaveCSS('align-items', 'center');

    await expect(component.getByTestId('nav-menu')).toHaveCSS('display', 'flex');
  });

  test('Deveria ser possível visualizar o usuário padrão', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithoutUser');

    await expect(component.getByTestId('user-name')).toHaveText('Usuário');
  });

  test('Deveria ser possível fechar o dropdown do usuário ao clicar fora dele', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await component.getByTestId('user-dropdown').click();
    await expect(component.getByTestId('dropdown-profile')).toBeVisible();

    await component.getByTestId('app-header').click({ position: { x: 5, y: 5 } });
    await expect(component.getByTestId('dropdown-profile')).toBeHidden();
  });

  test('Deveria ser possível navegar para o perfil ao clicar na Opção Perfil', async ({ mount }) => {
    const component = await mount('components/AppHeader/WithUser');

    await component.getByTestId('user-dropdown').click();
    await component.getByTestId('dropdown-profile-update').click();

    await expect(component.getByTestId('current-route')).toHaveValue('/profile');
  });
});
