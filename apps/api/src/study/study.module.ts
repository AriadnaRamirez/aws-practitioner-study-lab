import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { StudyStore } from './study.store';

@Module({
  imports: [ContentModule],
  controllers: [StudyController],
  providers: [StudyStore, StudyService],
  exports: [StudyService],
})
export class StudyModule {}
