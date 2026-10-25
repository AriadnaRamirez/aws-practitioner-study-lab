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
}
