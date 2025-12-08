import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../app.module';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    test('Deve autenticar o usuário e retornar o token JWT', async () => {
      const credenciais = {
        email: 'generic@example.com',
        password: '123456',
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(credenciais);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login realizado com sucesso!');
    });

    test('Deve retornar 400 para credenciais inválidas', async () => {
      const credenciais = {
        email: 'usuario.inexistente@example.com',
        senha: 'senha_invalida',
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(credenciais);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });

    test('Deve retornar 401 para senha inválida', async () => {
      const credenciais = {
        email: 'generic@example.com',
        password: '1234567',
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(credenciais);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('A senha não confere.');
    });
  });

  describe('POST /auth/logout', () => {
    test('Deve deslogar o usuário e retornar 200', async () => {
      const response = await request(app.getHttpServer()).post('/auth/logout');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('O usuário foi deslogado com sucesso!');
    });
  });
});
