import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { HealthyController } from '../healthy.controller';
import { HealthyService } from '../healthy.service';

describe('HealthyController', () => {
  let controller: HealthyController;

  const mockPrismaService = {
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthyController],
      providers: [
        HealthyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = moduleFixture.get<HealthyController>(HealthyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar status 200', async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await controller.healthy(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'healthy',
      timestamp: expect.any(String),
      message: 'Sistema saudável',
    });
  });

  it('Deve retornar status 503', async () => {
    jest.spyOn(mockPrismaService, '$queryRaw').mockRejectedValueOnce(new Error('DB Error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await controller.healthy(res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: 'unhealthy',
      timestamp: expect.any(String),
      message: 'Banco de dados indisponível',
    });
  });
});
