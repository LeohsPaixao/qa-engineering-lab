import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthyService } from './healthy.service';

@ApiTags('healthy')
@Controller('healthy')
export class HealthyController {
  constructor(private readonly healthyService: HealthyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar saúde do sistema' })
  @ApiResponse({ status: 200, description: 'Sistema saudável' })
  async healthy() {
    return this.healthyService.healthy();
  }
}
