import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecordMinigameResultDto } from './dto/record-minigame-result.dto';
import { MinigamesService } from './minigames.service';

@ApiTags('me-minigames')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/minigames')
export class MinigamesController {
  constructor(private readonly minigames: MinigamesService) {}

  @Get()
  @ApiOperation({ summary: 'Etiquetas de minijuegos (jugado / completado)' })
  @ApiOkResponse({ description: 'Record<resultId, "played" | "completed">' })
  list(@Req() req: { user: User }) {
    return this.minigames.list(req.user.id);
  }

  @Post('results')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Registrar una partida terminada (completado nunca vuelve a jugado)',
  })
  @ApiOkResponse({ description: 'Record<resultId, "played" | "completed">' })
  @ApiBadRequestResponse({ description: 'resultId desconocido' })
  record(@Req() req: { user: User }, @Body() dto: RecordMinigameResultDto) {
    return this.minigames.record(req.user.id, dto);
  }
}
