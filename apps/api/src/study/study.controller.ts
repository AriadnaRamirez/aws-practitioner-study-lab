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
import { AnswerStudyDto, StartStudySessionDto } from './dto/study.dto';
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
      'Start a study session (EXAM_STUDY: ExamQuestion bank + miss-repeat)',
  })
  @ApiOkResponse({ description: 'Session view with current prompt' })
  start(@Req() req: { user: User }, @Body() dto: StartStudySessionDto) {
    return this.study.startSession({
      userId: req.user.id,
      mode: dto.mode,
      size: dto.size,
      topicIds: dto.topicIds,
    });
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get active/completed session view' })
  get(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getSession(id, req.user.id);
  }

  @Post('sessions/:id/answer')
  @ApiOperation({
    summary: 'Answer current prompt; miss-repeat requeues failures',
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

  @Get('sessions/:id/summary')
  @ApiOperation({ summary: 'Summary for a completed session' })
  summary(@Req() req: { user: User }, @Param('id') id: string) {
    return this.study.getSummary(id, req.user.id);
  }
}
