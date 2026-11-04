import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AdminGuard, ApiAdminTokenHeader } from '../common/guards/admin.guard';
import { RunImportDto } from './dto/import-export.dto';
import { ImportExportService } from './import-export.service';

@ApiTags('admin-import')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({
  description: 'Missing/invalid admin session (Bearer JWT, role ADMIN)',
})
@UseGuards(AdminGuard)
@Controller('admin/import')
export class AdminImportController {
  constructor(private readonly importExport: ImportExportService) {}

  @Post()
  @ApiOperation({
    summary:
      'Import topics/knowledge/questions from CSV or JSON (dry-run by default)',
  })
  @ApiOkResponse({ description: 'Import job result (incl. dry-run)' })
  run(@Body() dto: RunImportDto) {
    return this.importExport.runImport({
      format: dto.format,
      content: dto.content,
      dryRun: dto.dryRun,
      filename: dto.filename,
    });
  }

  @Get('jobs')
  @ApiOperation({ summary: 'List recent import jobs (newest first)' })
  listJobs() {
    return this.importExport.listJobs();
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get one import job' })
  getJob(@Param('id') id: string) {
    return this.importExport.getJob(id);
  }
}

@ApiTags('admin-export')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({
  description: 'Missing/invalid admin session (Bearer JWT, role ADMIN)',
})
@UseGuards(AdminGuard)
@Controller('admin/export')
export class AdminExportController {
  constructor(private readonly importExport: ImportExportService) {}

  @Get()
  @ApiOperation({
    summary: 'Export topics / knowledge / questions as JSON or CSV',
  })
  @ApiProduces('application/json', 'text/csv')
  @ApiOkResponse({ description: 'Export bundle or CSV text' })
  async export(
    @Query('format') format: 'json' | 'csv' = 'json',
    @Query('entities') entities?: string,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const list = entities
      ?.split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    if (format === 'csv') {
      const csv = await this.importExport.exportCsv({ entities: list });
      res?.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res?.setHeader(
        'Content-Disposition',
        'attachment; filename="aps-content-export.csv"',
      );
      return csv;
    }

    return this.importExport.exportBundle({ entities: list });
  }
}
