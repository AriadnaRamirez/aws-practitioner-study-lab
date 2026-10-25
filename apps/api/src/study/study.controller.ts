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
import {
  AnswerExamTimedDto,
  AnswerStudyDto,
  MarkReviewDto,
  StartStudySessionDto,
} from './dto/study.dto';
import { StudyService } from './study.service';

@ApiTags('study')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('study')
export class StudyController {
  constructor(private readonly study: StudyService) {}

  @Post('sessions')
  @ApiOperation({
    summary:
      'Start session: EXAM_STUDY (miss-repeat) or EXAM_TIMED (cronometrado)',
  })
  @ApiOkResponse({ description: 'Session view (study or timed)' })
  start(@Req() req: { user: User }, @Body() dto: StartStudySessionDto) {
    return this.study.startSession({
      userId: req.user.id,
      mode: dto.mode,
      size: dto.size,
      topicIds: dto.topicIds,
      timezone: dto.timezone,
    });
  }

  @Get('sessions/:id')
  @ApiOperation({
    summary: 'Get session (EXAM_STUDY view or EXAM_TIMED view)',
  })
  get(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getAnySession(req.user.id, id);
  }

  @Post('sessions/:id/answer')
  @ApiOperation({
    summary: 'Answer current EXAM_STUDY prompt (live feedback + miss-repeat)',
  })
  answer(
    @Req() req: { user: User },
    @Param('id') id: string,
    @Body() dto: AnswerStudyDto,
  ) {
    return this.study.answer(
      id,
      req.user.id,
      dto.queueItemId,
      dto.choiceIndex,
    );
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
  @ApiOperation({ summary: 'Summary (EXAM_STUDY completed or EXAM_TIMED)' })
  summary(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getAnySummary(req.user.id, id);
  }
}
