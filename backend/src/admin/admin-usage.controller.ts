import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { AdminUsageService } from './admin-usage.service';

@ApiTags('admin-usage')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({ description: 'Missing/invalid x-admin-token' })
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminUsageController {
  constructor(private readonly usage: AdminUsageService) {}

  @Get('usage')
  @ApiOperation({
    summary:
      'Resumen de uso owner: usuarios, guests, conversión, sesiones guest (sin heatmaps de conocimiento)',
  })
  @ApiOkResponse({ description: 'UsageSummary' })
  usageSummary() {
    return this.usage.getUsageSummary();
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios registrados' })
  @ApiOkResponse({ description: 'AdminUserRow[]' })
  listUsers() {
    return this.usage.listUsers();
  }

  @Get('guests')
  @ApiOperation({ summary: 'Listar GuestProbes de marketing' })
  @ApiOkResponse({ description: 'AdminGuestRow[]' })
  listGuests() {
    return this.usage.listGuests();
  }
}
