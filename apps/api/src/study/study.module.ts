import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

@Module({
  imports: [ContentModule],
  controllers: [StudyController],
  providers: [StudyService],
  exports: [StudyService],
})
export class StudyModule {}
