import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GuestService } from './guest.service';

@ApiTags('guest')
@Controller('guest')
export class GuestController {
  constructor(private readonly guest: GuestService) {}

  @Post('probes')
  @ApiOperation({
    summary: 'Crear GuestProbe de marketing (sesión limitada, sin progreso)',
  })
  @ApiOkResponse({ description: 'GuestProbe creado' })
  createProbe() {
    return this.guest.createProbe();
  }

  @Get('probes/:id')
  @ApiOperation({ summary: 'Obtener estado de un GuestProbe' })
  getProbe(@Param('id') id: string) {
    return this.guest.getProbe(id);
  }

  @Post('probes/:id/sessions')
  @ApiOperation({
    summary:
      'Registrar una sesión guest completada (tope GUEST_MAX_SESSIONS)',
  })
  recordSession(@Param('id') id: string) {
    return this.guest.recordSession(id);
  }
}
