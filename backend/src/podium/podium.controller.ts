import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PODIUM_WINDOWS, type PodiumWindow } from '@aps/shared';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PodiumService } from './podium.service';

function parseWindow(raw: string | undefined): PodiumWindow {
  const value = (raw ?? 'all') as PodiumWindow;
  if (!(PODIUM_WINDOWS as readonly string[]).includes(value)) {
    throw new BadRequestException(
      `window inválido. Usa: ${PODIUM_WINDOWS.join(' | ')}`,
    );
  }
  return value;
}

@ApiTags('podium')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('podium')
export class PodiumController {
  constructor(private readonly podiumService: PodiumService) {}

  @Get()
  @ApiOperation({
    summary:
      'Ranking por ítems dominados (all-time o semana rodante 7×24h). Solo cuentas; respeta podiumHidden.',
  })
  @ApiQuery({
    name: 'window',
    required: false,
    enum: PODIUM_WINDOWS,
    description: 'all = histórico; week = últimos 7×24h (masteredAt)',
  })
  @ApiOkResponse({ description: 'Podio + posición del usuario actual' })
  getPodium(
    @Req() req: { user: User },
    @Query('window') windowRaw?: string,
  ) {
    return this.podiumService.getPodium(parseWindow(windowRaw), req.user);
  }
}
