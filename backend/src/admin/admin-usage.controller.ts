import {
  Body,
  Controller,
  Get,
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
import { AdminGuard, ApiAdminTokenHeader } from '../common/guards/admin.guard';
import { AdminUsageService } from './admin-usage.service';
import { UpdateAdminUserDto } from './dto/admin-user.dto';

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
      'Resumen de uso owner: usuarios, guests, DAU/WAU, finish rate (sin heatmaps de conocimiento)',
  })
  @ApiOkResponse({ description: 'UsageSummary' })
  usageSummary() {
    return this.usage.getUsageSummary();
  }

  @Get('metrics')
  @ApiOperation({
    summary:
      'Métricas owner: series diarias (28 días), KPIs 7d vs 7d previos, embudo, conceptos más fallados, actividad reciente',
  })
  @ApiOkResponse({ description: 'AdminMetrics' })
  metrics() {
    return this.usage.getMetrics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios registrados' })
  @ApiOkResponse({ description: 'AdminUserRow[]' })
  listUsers() {
    return this.usage.listUsers();
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Actualizar podiumHidden / soft-ban' })
  @ApiOkResponse({ description: 'AdminUserRow' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.usage.updateUser(id, dto);
  }

  @Post('users/:id/reset-password')
  @ApiOperation({
    summary: 'Generar contraseña temporal (devuelta una vez en la respuesta)',
  })
  @ApiOkResponse({ description: 'AdminResetPasswordResponse' })
  resetPassword(@Param('id') id: string) {
    return this.usage.resetPassword(id);
  }

  @Get('guests')
  @ApiOperation({ summary: 'Listar GuestProbes de marketing' })
  @ApiOkResponse({ description: 'AdminGuestRow[]' })
  listGuests() {
    return this.usage.listGuests();
  }
}
