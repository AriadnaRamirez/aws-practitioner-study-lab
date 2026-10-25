import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List topics (public read)' })
  @ApiOkResponse({ description: 'All topics in sort order' })
  list() {
    return this.content.listTopics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get topic by id' })
  @ApiOkResponse({ description: 'Topic' })
  get(@Param('id') id: string) {
    return this.content.getTopic(id);
  }
}
