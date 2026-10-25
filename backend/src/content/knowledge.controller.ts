import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('knowledge')
@Controller('knowledge-items')
export class KnowledgeController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @ApiOperation({
    summary: 'List published knowledge items (public read)',
  })
  @ApiQuery({ name: 'topicId', required: false })
  @ApiOkResponse({ description: 'Published KnowledgeItems' })
  list(@Query('topicId') topicId?: string) {
    return this.content.listKnowledge({ publishedOnly: true, topicId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get published knowledge item' })
  @ApiOkResponse({ description: 'KnowledgeItem' })
  get(@Param('id') id: string) {
    return this.content.getKnowledge(id, { publishedOnly: true });
  }
}
