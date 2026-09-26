import { faker } from '@faker-js/faker';
import { APIRequestContext, expect } from '@playwright/test';
import { userCreateSchema } from '../schemas/users.schema';
import { generateValidCPF } from '../shared/generateValidCPF';
import { validateSchema } from './validateSchema';

/**
 * Realiza a criação de um usuário na API
 * @param request - Request da API
 * @returns ID do usuário criado
 */
export async function createUser(request: APIRequestContext): Promise<number> {

  const full_name = faker.person.fullName();
  const social_name = faker.person.firstName();
  const email = faker.internet.email();
  const document = generateValidCPF();
  const phone = faker.phone.number();
  const password = '123456';
  const createResponse = await request.post('/users', {
    data: {
      full_name: full_name,
      social_name: social_name,
      email: email,
      password: password,
      doc_type: 'cpf',
      document: document,
      phone: phone,
    },
  });

  const createdUser = await createResponse.json();
  const parse = validateSchema(userCreateSchema, createdUser);

  expect(parse).toMatchObject({
    message: 'Usuário criado com sucesso!',
    user: expect.objectContaining({
      id: expect.any(Number),
      full_name: expect.any(String),
      social_name: expect.any(String),
      email: expect.any(String),
      document: expect.any(String),
      phone: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  });
  expect(createResponse.status()).toBe(201);

  return parse.user.id;
}