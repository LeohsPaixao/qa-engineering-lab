import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthyService {
  constructor(private readonly prisma: PrismaService) {}
  async healthy() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'Sistema saudável',
      };
    } catch {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        message: 'Banco de dados indisponível',
      };
    }
  }
}
