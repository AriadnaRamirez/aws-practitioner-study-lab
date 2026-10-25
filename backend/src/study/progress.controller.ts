import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListLimitQueryDto } from './dto/study.dto';
import { StudyService } from './study.service';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly studyService: StudyService) {}

  @Get('weak-items')
  @ApiOperation({
    summary: 'Ítems más fallados del usuario (failCount DESC)',
  })
  @ApiOkResponse({ description: 'Lista weak items enriquecida' })
  listWeak(
    @Req() req: { user: User },
    @Query() query: ListLimitQueryDto,
  ) {
    return this.studyService.listWeakItems(req.user.id, query.limit ?? 50);
  }

  @Get('overview')
  @ApiOperation({
    summary: 'Resumen de dominio, racha y sesiones activas (dashboard)',
  })
  overview(@Req() req: { user: User }) {
    return this.studyService.getProgressOverview(req.user.id);
  }

  @Get('by-topic')
  @ApiOperation({ summary: '% dominio por tema' })
  byTopic(@Req() req: { user: User }) {
    return this.studyService.getTopicProgress(req.user.id);
  }
}
