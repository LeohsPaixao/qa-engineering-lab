import { expect, test } from '@playwright/test';

test.describe('AppFooter', () => {

  test('Deveria ser possivel visualizar o footer', async ({ mount }) => {
    const component = await mount('components/AppFooter/Footer');

    await expect(component.getByTestId('app-footer')).toBeVisible();
  });

  test('Deveria ser possivel visualizar a mensagem de copyright', async ({ mount }) => {
    const component = await mount('components/AppFooter/Footer');

    const year = new Date().getFullYear();
    await expect(component.getByTestId('message-footer')).toHaveText(`© ${year} QA Engineering Lab - Todos os direitos reservados`);
  });

  test('Deveria ser possivel visualizar o link do GitHub', async ({ mount }) => {
    const component = await mount('components/AppFooter/Footer');

    await expect(component.getByTestId('github-link')).toBeVisible();
    await expect(component.getByTestId('github-link')).toHaveAttribute('href', 'https://github.com/LeohsPaixao/qa-engineering-lab');
    await expect(component.getByTestId('github-link')).toHaveAttribute('target', '_blank');
    await expect(component.getByTestId('github-link')).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(component.getByTestId('github-link')).toHaveAttribute('aria-label', 'Visitar repositório no GitHub');
  });

  test('Deveria ser possivel visualizar o ícone do GitHub', async ({ mount }) => {
    const component = await mount('components/AppFooter/Footer');

    await expect(component.getByTestId('github-icon')).toBeVisible();
    await expect(component.getByTestId('github-icon')).toHaveAttribute('alt', 'GitHub');
  });
});