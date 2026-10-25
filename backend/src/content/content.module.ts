import { Module } from '@nestjs/common';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';
import {
  AdminExportController,
  AdminImportController,
} from './admin-import.controller';
import { AdminKnowledgeController } from './admin-knowledge.controller';
import { AdminQuestionsController } from './admin-questions.controller';
import { AdminTopicsController } from './admin-topics.controller';
import { ContentService } from './content.service';
import { ImportExportService } from './import-export.service';
import { KnowledgeController } from './knowledge.controller';
import { QuestionsController } from './questions.controller';
import { TopicsController } from './topics.controller';

@Module({
  imports: [FeatureFlagsModule],
  controllers: [
    TopicsController,
    KnowledgeController,
    QuestionsController,
    AdminTopicsController,
    AdminKnowledgeController,
    AdminQuestionsController,
    AdminImportController,
    AdminExportController,
  ],
  providers: [ContentService, ImportExportService],
  exports: [ContentService, ImportExportService],
})
export class ContentModule {}
