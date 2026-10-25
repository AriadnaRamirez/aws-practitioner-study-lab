import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnswerFlashDto } from './dto/answer.dto';
import { StartFlashSessionDto } from './dto/start-session.dto';
import { StudyService } from './study.service';

@ApiTags('study')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('study')
export class StudyController {
  constructor(private readonly study: StudyService) {}

  @Post('sessions')
  @ApiOperation({
    summary: 'Iniciar sesión FLASH_STUDY (JWT requerido)',
  })
  @ApiOkResponse({ description: 'Sesión activa + primera carta' })
  start(@Req() req: { user: User }, @Body() dto: StartFlashSessionDto) {
    return this.study.startFlashSession(req.user, dto);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Estado actual de la sesión' })
  get(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getSession(req.user, id);
  }

  @Post('sessions/:id/answer')
  @ApiOperation({
    summary: 'Responder carta (miss-repeat + dominio 3 seguidos)',
  })
  answer(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() dto: AnswerFlashDto,
  ) {
    return this.study.answer(req.user, id, dto);
  }

  @Get('sessions/:id/summary')
  @ApiOperation({ summary: 'Resumen de sesión completada' })
  summary(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getSummary(req.user, id);
  }
}
