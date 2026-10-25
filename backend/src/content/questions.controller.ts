import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('exam-questions')
@Controller('exam-questions')
export class QuestionsController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @ApiOperation({
    summary: 'List published exam questions (public read)',
  })
  @ApiQuery({ name: 'topicId', required: false })
  @ApiOkResponse({ description: 'Published ExamQuestions' })
  list(@Query('topicId') topicId?: string) {
    return this.content.listQuestions({ publishedOnly: true, topicId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published exam question' })
  @ApiOkResponse({ description: 'ExamQuestion' })
  get(@Param('id') id: string) {
    return this.content.getQuestion(id, { publishedOnly: true });
  }
}
