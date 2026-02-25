import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HealthyService } from './healthy.service';

@ApiTags('healthy')
@Controller('healthy')
export class HealthyController {
  constructor(private readonly healthyService: HealthyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar saúde do sistema' })
  @ApiResponse({ status: 200, description: 'Sistema saudável' })
  @ApiResponse({ status: 503, description: 'Sistema indisponível' })
  async healthy(@Res() res: Response) {
    const result = await this.healthyService.healthy();
    const status = result.status === 'healthy' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(result);
  }
}
