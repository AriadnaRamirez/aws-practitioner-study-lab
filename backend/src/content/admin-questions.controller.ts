import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AdminGuard,
  ApiAdminTokenHeader,
} from '../common/guards/admin.guard';
import { ContentService } from './content.service';
import {
  CreateExamQuestionDto,
  UpdateExamQuestionDto,
} from './dto/content.dto';

@ApiTags('admin-exam-questions')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({ description: 'Missing/invalid x-admin-token' })
@UseGuards(AdminGuard)
@Controller('admin/exam-questions')
export class AdminQuestionsController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: list all exam questions (any status)' })
  @ApiQuery({ name: 'topicId', required: false })
  @ApiOkResponse({ description: 'ExamQuestions' })
  list(@Query('topicId') topicId?: string) {
    return this.content.listQuestions({ topicId, allTracks: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: get exam question' })
  get(@Param('id') id: string) {
    return this.content.getQuestion(id, { allTracks: true });
  }

  @Post()
  @ApiOperation({ summary: 'Admin: create exam question' })
  create(@Body() dto: CreateExamQuestionDto) {
    return this.content.createQuestion(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update exam question' })
  update(@Param('id') id: string, @Body() dto: UpdateExamQuestionDto) {
    return this.content.updateQuestion(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Admin: delete exam question' })
  async remove(@Param('id') id: string) {
    await this.content.deleteQuestion(id);
  }
}
