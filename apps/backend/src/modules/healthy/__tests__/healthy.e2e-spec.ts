import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthyController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it('Deve retornar status 200', async () => {
    const response = await request(app.getHttpServer()).get('/healthy');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      message: 'Sistema saudável',
    });
  });

  it('Deve retornar status 503', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValue(new Error('Database error'));

    const response = await request(app.getHttpServer()).get('/healthy');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'unhealthy',
      timestamp: expect.any(String),
      message: 'Banco de dados indisponível',
    });
  });
});
