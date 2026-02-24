import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthyService {
  async healthy() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'Sistema saudável',
    };
  }
}
