import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { generateValidCPF } from '../../../utils/generatedValidCPF';
import { PrismaService } from '../../prisma/prisma.service';

describe('Users', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdUser: User;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    createdUser = await prisma.user.create({
      data: {
        full_name: 'Nome de Teste',
        social_name: 'Social de Teste',
        email: 'teste-dados-usuario@example.com',
        password: 'senha123',
        document: generateValidCPF(),
        doc_type: 'cpf',
        phone: '(11) 99999-9999',
      },
    });

    const jwtSecret = process.env.JWT_SECRET as string;
    token = jwt.sign({ sub: createdUser.id }, jwtSecret);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    test('Deve registrar um novo usuário', async () => {
      const novoUsuario = {
        full_name: faker.person.fullName(),
        social_name: faker.person.middleName(),
        document: generateValidCPF(),
        doc_type: 'cpf',
        phone: faker.phone.number({ style: 'national' }),
        email: faker.internet.email({ provider: 'qa.solar.com' }),
        password: '123456',
      };

      const response = await request(app.getHttpServer()).post('/users').send(novoUsuario);

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Usuário criado com sucesso!');
    });

    test('Deve retornar 409 para e-mail em uso', async () => {
      const novoUsuario = {
        full_name: faker.person.fullName(),
        social_name: faker.person.middleName(),
        document: generateValidCPF(),
        doc_type: 'cpf',
        phone: faker.phone.number({ style: 'national' }),
        email: 'generic@example.com',
        password: '123456',
      };

      const response = await request(app.getHttpServer()).post('/users').send(novoUsuario);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe('E-mail já está em uso.');
    });

    test('Deve retornar 409 para CPF/CNPJ em uso', async () => {
      const novoUsuario = {
        full_name: faker.person.fullName(),
        social_name: faker.person.middleName(),
        document: '591.013.230-08',
        doc_type: 'cpf',
        phone: faker.phone.number({ style: 'national' }),
        email: 'generic@example.com',
        password: '123456',
      };

      const response = await request(app.getHttpServer()).post('/users').send(novoUsuario);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe('CPF ou CNPJ já está em uso.');
    });
  });

  describe('GET /users', () => {
    test('Deve retornar 200 para obter todos os usuários', async () => {
      const response = await request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });

    test('Deve retornar 404 para nenhum usuário encontrado', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue([]);

      const response = await request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Nenhum usuário encontrado.');
    });
  });

  describe('GET /users/me', () => {
    test('Deve retornar os dados do usuário logado', async () => {
      const response = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe('teste-dados-usuario@example.com');
    });

    test('Deve retornar 404 para usuário não encontrado', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(`Usuário com o ID: ${createdUser.id} não encontrado.`);
    });
  });

  describe('PATCH /users/me', () => {
    test('Deve atualizar os dados do usuário logado', async () => {
      const novoDado = {
        full_name: 'Nome Atualizado',
        social_name: 'Social Atualizado',
        phone: '(11) 88888-8888',
      };

      const response = await request(app.getHttpServer()).patch('/users/me').set('Authorization', `Bearer ${token}`).send(novoDado);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Usuário alterado com sucesso!');
    });

    test('Deve atualizar os dados do usuário sem socialName', async () => {
      const novoDado = {
        full_name: 'Nome Atualizado',
        phone: '(11) 88888-8888',
      };

      const response = await request(app.getHttpServer()).patch('/users/me').set('Authorization', `Bearer ${token}`).send(novoDado);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Usuário alterado com sucesso!');
    });

    test('Deve atualizar os dados do usuário sem phone', async () => {
      const novoDado = {
        full_name: 'Nome Atualizado',
        social_name: 'Social Atualizado',
      };

      const response = await request(app.getHttpServer()).patch('/users/me').set('Authorization', `Bearer ${token}`).send(novoDado);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Usuário alterado com sucesso!');
    });

    test('Deve retornar 404 para usuário não encontrado', async () => {
      jest.spyOn(prisma.user, 'update').mockResolvedValue(null as any);

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ full_name: 'Nome Atualizado' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado para atualizar.');
    });
  });

  describe('DELETE /users/delete', () => {
    let idUserLogged: string;

    beforeEach(async () => {
      const credenciais = {
        email: 'generic@example.com',
        password: '123456',
      };

      const userLogged = await request(app.getHttpServer()).post('/auth/login').send(credenciais);

      token = userLogged.body.token;
      const jwtSecret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, jwtSecret) as { sub: string };
      idUserLogged = decoded.sub;
    });

    test('Deve excluir o usuário com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({ ids: [createdUser.id] });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('1 usuário(s) excluído(s) com sucesso!');
    });

    test('Deve retornar 404 para usuário não encontrado', async () => {
      jest.spyOn(prisma.user, 'deleteMany').mockResolvedValue({ count: 0 } as any);

      const response = await request(app.getHttpServer())
        .delete('/users/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({ ids: [createdUser.id] });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Nenhum usuário encontrado para excluir.');
    });

    test('Deve retornar 400 para exclusão de usuário logado', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({ ids: [idUserLogged] });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Você não pode excluir o usuário logado.');
    });
  });
});
