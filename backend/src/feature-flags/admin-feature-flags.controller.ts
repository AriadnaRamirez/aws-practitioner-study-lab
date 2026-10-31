import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard, ApiAdminTokenHeader } from '../common/guards/admin.guard';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { FeatureFlagsService } from './feature-flags.service';

@ApiTags('admin-feature-flags')
@ApiAdminTokenHeader()
@ApiUnauthorizedResponse({
  description: 'Missing/invalid admin session (Bearer JWT, role ADMIN)',
})
@UseGuards(AdminGuard)
@Controller('admin/feature-flags')
export class AdminFeatureFlagsController {
  constructor(private readonly flags: FeatureFlagsService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: list feature flags' })
  @ApiOkResponse({ description: 'Feature flags' })
  list() {
    return this.flags.list();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Admin: get feature flag' })
  get(@Param('key') key: string) {
    return this.flags.get(key);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Admin: toggle / set feature flag' })
  @ApiOkResponse({ description: 'Updated feature flag' })
  update(@Param('key') key: string, @Body() dto: UpdateFeatureFlagDto) {
    return this.flags.setEnabled(key, dto.enabled, dto.updatedBy);
  }
}
