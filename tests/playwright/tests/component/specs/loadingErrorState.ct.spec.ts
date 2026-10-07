import { expect, test } from '@playwright/test';

test.describe('LoadingErrorState', () => {
  test('Não deveria renderizar nada quando não há loading nem erro', async ({ mount }) => {
    const component = await mount('components/LoadingErrorState/Default');

    await expect(component.getByTestId('loading-container')).toBeHidden();
    await expect(component.getByTestId('error-container')).toBeHidden();
  });

  test('Deveria ser possível exibir o spinner durante o carregamento', async ({ mount }) => {
    const component = await mount('components/LoadingErrorState/Loading');

    await expect(component.getByTestId('loading-container')).toBeVisible();
    await expect(component.getByTestId('loading-message')).toHaveText('Carregando...');
    await expect(component.getByTestId('spinner')).toBeVisible();
    await expect(component.getByTestId('error-container')).toBeHidden();
  });

  test('Deveria ser possível exibir a mensagem de erro padrão', async ({ mount }) => {
    const component = await mount('components/LoadingErrorState/WithError');

    await expect(component.getByTestId('error-container')).toBeVisible();
    await expect(component.getByTestId('error-message')).toHaveText('Erro ao carregar os dados do usuário.');
    await expect(component.getByTestId('loading-container')).toBeHidden();
  });

  test('Deveria ser possível renderizar a mensagem de erro recebida via props', async ({ mount }) => {
    const component = await mount('components/LoadingErrorState/WithErrorMessage', {
      errorMessage: 'Falha ao comunicar com o servidor.',
    });

    await expect(component.getByTestId('error-message')).toHaveText('Falha ao comunicar com o servidor.');
  });

  test('Deveria ser possível atualizar a mensagem de erro sem remontar a story', async ({ mount }) => {
    const component = await mount('components/LoadingErrorState/WithErrorMessage', {
      errorMessage: 'Primeira mensagem.',
    });

    await expect(component.getByTestId('error-message')).toHaveText('Primeira mensagem.');

    await component.update({ errorMessage: 'Segunda mensagem.' });

    await expect(component.getByTestId('error-message')).toHaveText('Segunda mensagem.');
  });

  test('Deveria ser possível falhar com erro explícito quando a story for desconhecida', async ({ mount }) => {
    await expect(mount('components/LoadingErrorState/Unknown')).rejects.toThrow('Unknown story');
  });

  test('Deveria priorizar o carregamento sobre o erro quando ambos forem true', async ({ mount }) => {
    const component = await mount('components/LoadingErrorState/Loading', {
      isError: true,
    });

    await expect(component.getByTestId('loading-container')).toBeVisible();
    await expect(component.getByTestId('error-container')).toBeHidden();
  });
});
