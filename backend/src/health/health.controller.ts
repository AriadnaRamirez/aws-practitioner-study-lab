import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { APP_NAME, type HealthResponse } from '@aps/shared';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Liveness / readiness scaffold' })
  @ApiOkResponse({ description: 'API is up' })
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'api',
      app: APP_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
