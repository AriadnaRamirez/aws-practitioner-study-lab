import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeatureFlagsService } from './feature-flags.service';

@ApiTags('feature-flags')
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly flags: FeatureFlagsService) {}

  @Get()
  @ApiOperation({ summary: 'List feature flags (public read)' })
  @ApiOkResponse({ description: 'Feature flags' })
  list() {
    return this.flags.list();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get one feature flag by key' })
  @ApiOkResponse({ description: 'Feature flag' })
  get(@Param('key') key: string) {
    return this.flags.get(key);
  }
}
