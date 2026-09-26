import { faker } from '@faker-js/faker';
import test, { expect } from '@playwright/test';
import { userCreateConflictErrorSchema, userCreateErrorSchema, userCreateSchema, userDeleteErrorSchema, userDeleteIDInvalidSchema, userDeleteSchema, userListSchema, userMeErrorSchema, userSchema, userUpdateSchema } from '../schemas/users.schema';
import { createUser } from '../shared/createUser';
import { generateValidCPF } from '../shared/generateValidCPF';
import { login } from '../shared/login';
import { validateSchema } from '../shared/validateSchema';

test.describe('API de Usuário', { annotation: { type: 'api', description: 'Teste de API de usuário' } }, () => {

  const full_name = faker.person.fullName();
  const social_name = faker.person.firstName();
  const email = faker.internet.email();
  const document = generateValidCPF();
  const phone = faker.phone.number();
  const password = '123456';

  test.describe('GET /users/me', { annotation: { type: 'get', description: "Testes de GET com o endpoint /users/me" } }, () => {
    test('Deve retornar os dados do usuário logado', async ({ request }) => {
      const token = await login(request);
      const response = await request.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userSchema, responseJson);

      expect(response.status()).toBe(200);
      expect(parse).toMatchObject({
        id: expect.any(Number),
        full_name: expect.any(String),
        email: expect.any(String),
        document: expect.any(String),
        phone: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      expect([null, expect.any(String)]).toContainEqual(parse.social_name);
    });

    test('Deve retornar erro 401 quando não estiver logado', async ({ request }) => {
      const response = await request.get('/users/me');
      const responseJson = await response.json();
      const parse = validateSchema(userMeErrorSchema, responseJson);

      expect(response.status()).toBe(401);
      expect(parse).toMatchObject({
        message: 'Unauthorized',
      });
    });
  });

  test.describe('GET /users', { annotation: { type: 'get', description: "Testes de GET com o endpoint /users" } }, () => {
    test('Deve ser possível listar os usuários cadastrados', async ({ request }) => {
      const token = await login(request);
      const response = await request.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userListSchema, responseJson);

      expect(response.status()).toBe(200);
      expect(parse).toEqual(
        expect.objectContaining({
          users: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              full_name: expect.any(String),
              email: expect.any(String),
              document: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
        }),
      );
      expect([null, expect.any(String)]).toContainEqual(parse.users[0].phone);
      expect([null, expect.any(String)]).toContainEqual(parse.users[0].social_name);
    });
  });

  test.describe('POST /users', { annotation: { type: 'post', description: "Testes de POST com o endpoint /users" } }, () => {
    test('Deve ser possível cadastrar um novo usuário', async ({ request }) => {
      const email = faker.internet.email();
      const document = generateValidCPF();

      const response = await request.post('/users', {
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

      const responseJson = await response.json();
      const parse = validateSchema(userCreateSchema, responseJson);

      expect(response.status()).toBe(201);
      expect(parse).toMatchObject({
        message: 'Usuário criado com sucesso!',
        user: expect.objectContaining({
          id: expect.any(Number),
          full_name: expect.any(String),
          email: expect.any(String),
          document: expect.any(String),
          phone: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      });
      expect([null, expect.any(String)]).toContainEqual(parse.user.social_name);
    });

    test('Não deve ser possível criar um usuário sem passar o tipo de documento', async ({ request }) => {
      const response = await request.post('/users', {
        data: {
          full_name: full_name,
          social_name: social_name,
          email: email,
          password: password,
          document: document,
          phone: phone,
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userCreateErrorSchema, responseJson);

      expect(response.status()).toBe(400);
      expect(parse).toMatchObject({
        message: [
          'doc_type should not be empty',
          'doc_type must be one of the following values: cpf, cnpj'
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    test('Não deve ser possível criar um usuário passando um valor incorreto do tipo de documento', async ({ request }) => {
      const response = await request.post('/users', {
        data: {
          full_name: full_name,
          social_name: social_name,
          email: email,
          password: password,
          doc_type: 'invalid',
          document: document,
          phone: phone,
        }
      });

      const responseJson = await response.json();
      const parse = validateSchema(userCreateErrorSchema, responseJson);

      expect(response.status()).toBe(400);
      expect(parse).toMatchObject({
        message: [
          'doc_type must be one of the following values: cpf, cnpj'
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    test('Não deve ser possível criar um usuário sem passar os dados obrigatórios', async ({ request }) => {
      const response = await request.post('/users', { data: {} });

      const responseJson = await response.json();
      const parse = validateSchema(userCreateErrorSchema, responseJson);

      expect(response.status()).toBe(400);
      expect(parse).toMatchObject({
        message: [
          "full_name should not be empty",
          "full_name must be a string",
          "document should not be empty",
          "document must be a string",
          "doc_type should not be empty",
          "doc_type must be one of the following values: cpf, cnpj",
          "email should not be empty",
          "email must be an email",
          "password must be longer than or equal to 6 characters",
          "password should not be empty",
          "password must be a string",
        ],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    test('Não deve criar um usuário com CPF já cadastrado', async ({ request }) => {
      const response = await request.post('/users', {
        data: {
          full_name: full_name,
          social_name: social_name,
          email: email,
          password: password,
          doc_type: 'cpf',
          document: '59101323008',
          phone: phone,
        }
      });

      const responseJson = await response.json();
      const parse = validateSchema(userCreateConflictErrorSchema, responseJson);

      expect(response.status()).toBe(409);
      expect(parse).toMatchObject({
        message: 'CPF ou CNPJ já está em uso.',
        error: 'Conflict',
        statusCode: 409,
      });
    });

    test('Não deve ser possível criar um usuário com email já cadastrado', async ({ request }) => {
      const response = await request.post('/users', {
        data: {
          full_name: full_name,
          social_name: social_name,
          email: 'generic@example.com',
          password: password,
          doc_type: 'cpf',
          document: document,
          phone: phone,
        }
      });

      const responseJson = await response.json();
      const parse = validateSchema(userCreateConflictErrorSchema, responseJson);

      expect(response.status()).toBe(409);
      expect(parse).toMatchObject({
        message: 'E-mail já está em uso.',
        error: 'Conflict',
        statusCode: 409,
      });
    });
  });

  test.describe('PATCH /users/me', { annotation: { type: 'patch', description: "Testes de PATCH com o endpoint /users/me" } }, () => {
    test('Deve ser possível atualizar dados do usuário com sucesso', async ({ request }) => {
      const token = await login(request);
      const response = await request.patch('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          full_name: full_name,
          social_name: social_name,
          phone: phone,
        }
      });

      const responseJson = await response.json();
      const parse = validateSchema(userUpdateSchema, responseJson);

      expect(response.status()).toBe(200);
      expect(parse).toMatchObject({
        message: 'Usuário alterado com sucesso!',
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
    });
  });

  test.describe('DELETE /users/delete', { annotation: { type: 'delete', description: "Testes de DELETE com o endpoint /users" } }, () => {
    test('Deve ser possível excluir um usuário com sucesso', async ({ request }) => {
      const token = await login(request);
      const userId = await createUser(request);

      const response = await request.delete('/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: [userId],
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userDeleteSchema, responseJson);

      expect(response.status()).toBe(200);
      expect(parse).toMatchObject({
        message: '1 usuário(s) excluído(s) com sucesso!',
      });
    });

    test('Deve ser possível excluir múltiplos usuários com sucesso', async ({ request }) => {
      const usersToDelete = [];

      const token = await login(request);
      for (let i = 0; i < 2; i++) {
        const userId = await createUser(request);
        usersToDelete.push(userId);
      }

      const response = await request.delete('/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: usersToDelete,
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userDeleteSchema, responseJson);

      expect(response.status()).toBe(200);
      expect(parse).toMatchObject({
        message: '2 usuário(s) excluído(s) com sucesso!',
      });
    });

    test('Não deve ser possível excluir o próprio usuário logado', async ({ request }) => {
      const token = await login(request);
      const meResponse = await request.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const meData = await meResponse.json();
      const currentUserId = meData.id;

      const response = await request.delete('/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: [currentUserId],
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userDeleteSchema, responseJson);

      expect(response.status()).toBe(405);
      expect(parse).toMatchObject({
        message: 'Você não pode excluir o usuário logado.',
      });
    });

    test('Deve retornar erro 404 quando nenhum usuário for encontrado para exclusão', async ({ request }) => {
      const token = await login(request);

      const response = await request.delete('/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: [999999],
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userDeleteIDInvalidSchema, responseJson);

      expect(response.status()).toBe(404);
      expect(parse).toMatchObject({
        message: 'Nenhum usuário encontrado para excluir.',
        error: 'Not Found',
        statusCode: 404,
      });
    });

    test('Deve retornar erro 401 quando não estiver logado', async ({ request }) => {
      const response = await request.delete('/users/delete', {
        data: {
          ids: [1],
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userDeleteSchema, responseJson);

      expect(response.status()).toBe(401);
      expect(parse).toMatchObject({
        message: 'Unauthorized',
      });
    });

    test('Não deve ser possível excluir usuários com array de IDs vazio', async ({ request }) => {
      const token = await login(request);

      const response = await request.delete('/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ids: [],
        },
      });

      const responseJson = await response.json();
      const parse = validateSchema(userDeleteErrorSchema, responseJson);

      expect(response.status()).toBe(400);
      expect(parse).toMatchObject({
        message: ['ids must contain at least 1 elements'],
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });
});