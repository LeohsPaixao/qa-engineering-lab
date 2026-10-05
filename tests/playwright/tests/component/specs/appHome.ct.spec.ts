import { expect, test } from "@playwright/test";

test.describe("AppHome", () => {
  test('Deveria ser possivel visualizar o conteúdo principal da página', async ({ mount }) => {
    const component = await mount('components/AppHome/Home');

    await expect(component.getByTestId('main')).toBeVisible();
  });

  test('Deveria ser possivel visualizar o logo do projeto', async ({ mount }) => {
    const component = await mount('components/AppHome/Home');

    await expect(component.getByTestId('home-logo')).toBeVisible();
    await expect(component.getByTestId('home-logo')).toHaveAttribute('alt', 'Logo QA E2E');
  });

  test('Deveria ser possivel visualizar a descrição do projeto', async ({ mount }) => {
    const component = await mount('components/AppHome/Home');

    await expect(component.getByTestId('project-description')).toBeVisible();
    await expect(component.getByTestId('project-description')).toHaveText(
      ' Este é um Laboratório de QA criado para quem acredita que qualidade não é apenas uma etapa do processo, mas uma mentalidade.  Aqui, exploramos a Qualidade de Software de forma ampla e estratégica, aplicando diferentes níveis e tipos de testes dentro de uma visão moderna de engenharia: Unit Tests, Integration Tests, API Tests, UI Tests, Testes Não Funcionais (performance, carga, resiliência), entre muitas outras abordagens.  O projeto promove a experimentação prática de conceitos como pirâmide de testes, shift-left testing, automação em CI/CD e boas práticas de arquitetura de testes. É um ambiente seguro para errar, aprender, comparar ferramentas e evoluir tecnicamente.  Sendo Open Source, este laboratório é um convite constante ao desafio: testar novas estratégias, validar hipóteses, aprimorar habilidades e construir uma visão sólida e moderna sobre qualidade. '
    );
  });
});