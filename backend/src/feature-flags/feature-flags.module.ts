import { Module } from '@nestjs/common';
import { AdminFeatureFlagsController } from './admin-feature-flags.controller';
import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';

@Module({
  controllers: [FeatureFlagsController, AdminFeatureFlagsController],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
