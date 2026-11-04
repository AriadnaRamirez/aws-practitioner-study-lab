import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import { ProgressController } from './progress.controller';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { StudyStore } from './study.store';

@Module({
  imports: [ContentModule, FeatureFlagsModule],
  controllers: [StudyController, ProgressController],
  providers: [StudyStore, StudyService],
  exports: [StudyService],
})
export class StudyModule {}
