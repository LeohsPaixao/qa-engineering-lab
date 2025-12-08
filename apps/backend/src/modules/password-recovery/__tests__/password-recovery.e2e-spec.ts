import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { generateValidCPF } from '../../../utils/generatedValidCPF';
import { PrismaService } from '../../prisma/prisma.service';

describe('Password Recovery', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    createdUser = await prisma.user.create({
      data: {
        full_name: faker.person.fullName(),
        social_name: faker.person.middleName(),
        email: faker.internet.email({ provider: 'qa.solar.com' }),
        password: 'senha123',
        document: generateValidCPF(),
        doc_type: 'cpf',
        phone: '(11) 99999-9999',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /password-recovery/forgot-password', () => {
    test('Deve retornar 200 para obter o email do usuário', async () => {
      const response = await request(app.getHttpServer()).post('/password-recovery/forgot-password').send({ email: createdUser.email });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Um e-mail foi enviado com instruções para recuperar a senha.');
    });

    test('Deve retornar 404 para email não encontrado', async () => {
      const response = await request(app.getHttpServer())
        .post('/password-recovery/forgot-password')
        .send({ email: 'usuario.inexistente@example.com' });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });
  });
});
