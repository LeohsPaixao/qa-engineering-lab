import { faker } from '@faker-js/faker';
import { request } from '@playwright/test';
import { generateValidCPF } from '../commands/generateValidCPF';

/**
 * Realiza o mock de criação de um usuário através de requisições HTTP.
 */
async function mockGenerateUsers(): Promise<void> {
  const apiContext = await request.newContext({
    baseURL: `${process.env.PLAY_API_URL}`,
  });

  const response = await apiContext.post('/users', {
    data: {
      full_name: faker.person.fullName(),
      social_name: faker.person.lastName(),
      document: generateValidCPF(),
      doc_type: 'cpf',
      phone: faker.phone.number({ style: 'national' }),
      email: faker.internet.email({ provider: 'example.qa.solar' }),
      password: '123456',
    },
  });

  if (!response.ok()) {
    throw new Error(`Erro ao criar usuário: ${response.status()}`);
  }
}

/**
 * Gera múltiplos usuários simulados.
 */
export async function generateUsers(): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await mockGenerateUsers();
  }
}
