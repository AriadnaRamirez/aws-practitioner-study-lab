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
  CreateKnowledgeItemDto,
  UpdateKnowledgeItemDto,
} from './dto/content.dto';

@ApiTags('admin-knowledge')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({ description: 'Missing/invalid x-admin-token' })
@UseGuards(AdminGuard)
@Controller('admin/knowledge-items')
export class AdminKnowledgeController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: list all knowledge items (any status)' })
  @ApiQuery({ name: 'topicId', required: false })
  @ApiOkResponse({ description: 'KnowledgeItems' })
  list(@Query('topicId') topicId?: string) {
    return this.content.listKnowledge({ topicId, allTracks: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: get knowledge item' })
  get(@Param('id') id: string) {
    return this.content.getKnowledge(id, { allTracks: true });
  }

  @Post()
  @ApiOperation({ summary: 'Admin: create knowledge item' })
  create(@Body() dto: CreateKnowledgeItemDto) {
    return this.content.createKnowledge(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update knowledge item' })
  update(@Param('id') id: string, @Body() dto: UpdateKnowledgeItemDto) {
    return this.content.updateKnowledge(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Admin: delete knowledge item' })
  async remove(@Param('id') id: string) {
    await this.content.deleteKnowledge(id);
  }
}
