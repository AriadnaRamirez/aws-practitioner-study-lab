import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import {
  AnswerExamTimedDto,
  AnswerStudyDto,
  ListLimitQueryDto,
  MarkReviewDto,
  StartStudySessionDto,
  StartWeakReviewDto,
} from './dto/study.dto';
import { StudyService } from './study.service';

@ApiTags('study')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('study')
export class StudyController {
  constructor(private readonly study: StudyService) {}

  @Get('sessions')
  @ApiOperation({ summary: 'Historial de sesiones del usuario' })
  @ApiOkResponse({ description: 'Lista de sesiones (más recientes primero)' })
  listSessions(
    @Req() req: { user: User },
    @Query() query: ListLimitQueryDto,
  ) {
    return this.study.listSessions(req.user.id, query.limit ?? 50);
  }

  @Post('sessions')
  @ApiOperation({
    summary:
      'Start FLASH_STUDY, EXAM_STUDY, WEAK_REVIEW or EXAM_TIMED (cronometrado)',
  })
  @ApiOkResponse({ description: 'Session view (flash, study or timed)' })
  start(@Req() req: { user: User }, @Body() dto: StartStudySessionDto) {
    return this.study.startSession({
      user: req.user,
      mode: dto.mode,
      size: dto.size,
      topicIds: dto.topicIds,
      timezone: dto.timezone,
    });
  }

  @Post('sessions/weak-review')
  @ApiOperation({
    summary: 'Iniciar sesión WEAK_REVIEW con las más falladas',
  })
  @ApiOkResponse({ description: 'Sesión creada con cola de refuerzo' })
  startWeakReview(
    @Req() req: { user: User },
    @Body() dto: StartWeakReviewDto,
  ) {
    return this.study
      .startWeakReview(req.user, dto.limit)
      .then((session) => ({ session }));
  }

  @Get('sessions/:id')
  @ApiOperation({
    summary: 'Get session (FLASH / EXAM_STUDY / WEAK_REVIEW / EXAM_TIMED)',
  })
  get(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getAnySession(req.user, id);
  }

  @Post('sessions/:id/answer')
  @ApiOperation({
    summary: 'Answer current FLASH_STUDY, EXAM_STUDY or WEAK_REVIEW prompt',
  })
  answer(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() dto: AnswerStudyDto,
  ) {
    return this.study.answerAny(req.user, id, dto);
  }

  @Post('sessions/:id/exam-answer')
  @ApiOperation({
    summary: 'Guardar respuesta EXAM_TIMED (sin revelar si es correcta)',
  })
  examAnswer(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() dto: AnswerExamTimedDto,
  ) {
    return this.study.answerTimed(
      req.user.id,
      id,
      dto.questionId,
      dto.choiceIndex,
    );
  }

  @Post('sessions/:id/mark-review')
  @ApiOperation({ summary: 'Marcar / desmarcar para revisar (EXAM_TIMED)' })
  markReview(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() dto: MarkReviewDto,
  ) {
    return this.study.markTimedReview(
      req.user.id,
      id,
      dto.questionId,
      dto.marked,
    );
  }

  @Post('sessions/:id/submit')
  @ApiOperation({
    summary: 'Enviar EXAM_TIMED → score + fallos con explicación',
  })
  submit(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.submitTimed(req.user.id, id);
  }

  @Get('sessions/:id/summary')
  @ApiOperation({ summary: 'Summary (FLASH / EXAM_STUDY / EXAM_TIMED)' })
  summary(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getAnySummary(req.user, id);
  }
}
