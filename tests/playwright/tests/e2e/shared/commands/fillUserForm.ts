import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';
import { generateValidCPF } from './generateValidCPF';

/**
 * Esta função preenche um formulário de usuário com dados gerados aleatoriamente usando Playwright e Faker.js.
 *
 * @observações
 * A função utiliza os atributos data-testid para localizar campos específicos no formulário e digita os dados gerados.
 *
 * @exemplo
 * ```typescript
 * fillUserForm();
 * ```
 *
 * @retorno {void} A função não retorna nenhum valor.
 */
export async function fillUserForm(page: Page) {
  const cpf = generateValidCPF();

  const formFields = [
    { element: page.locator('[data-testid="input-fullname"]'), valor: faker.person.fullName() },
    { element: page.locator('[data-testid="input-socialname"]'), valor: faker.person.middleName() },
    { element: page.locator('[data-testid="input-document"]'), valor: cpf },
    { element: page.locator('[data-testid="input-phone"]'), valor: faker.phone.number({ style: 'national' }) },
    { element: page.locator('[data-testid="input-email"]'), valor: faker.internet.email({ provider: 'example.qa.solar' }) },
    { element: page.locator('[data-testid="input-password"]'), valor: '123456' },
    { element: page.locator('[data-testid="input-confirm-password"]'), valor: '123456' },
  ];

  for (const field of formFields) {
    await field.element.waitFor({ state: 'visible' });
    await field.element.fill(field.valor);
  }
}
