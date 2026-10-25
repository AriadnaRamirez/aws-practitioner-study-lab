import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AdminGuard,
  ApiAdminTokenHeader,
} from '../common/guards/admin.guard';
import { ContentService } from './content.service';
import { CreateTopicDto, UpdateTopicDto } from './dto/content.dto';

@ApiTags('admin-topics')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({ description: 'Missing/invalid x-admin-token' })
@UseGuards(AdminGuard)
@Controller('admin/topics')
export class AdminTopicsController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: list all topics' })
  @ApiOkResponse({ description: 'Topics' })
  list() {
    return this.content.listTopics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: get topic' })
  get(@Param('id') id: string) {
    return this.content.getTopic(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: create topic' })
  create(@Body() dto: CreateTopicDto) {
    return this.content.createTopic(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update topic' })
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.content.updateTopic(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Admin: delete topic' })
  remove(@Param('id') id: string) {
    this.content.deleteTopic(id);
  }
}
