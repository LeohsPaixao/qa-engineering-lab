import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    const maxRetries = 20;
    const delay = 3000;

    for (let i = 1; i <= maxRetries; i++) {
      try {
        await this.$connect();
        return;
      } catch {
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    throw new Error('Não conseguiu conectar ao banco após múltiplas tentativas.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
