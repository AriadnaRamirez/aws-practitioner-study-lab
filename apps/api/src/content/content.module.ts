import { Module } from '@nestjs/common';
import { AdminKnowledgeController } from './admin-knowledge.controller';
import { AdminQuestionsController } from './admin-questions.controller';
import { AdminTopicsController } from './admin-topics.controller';
import { ContentService } from './content.service';
import { KnowledgeController } from './knowledge.controller';
import { QuestionsController } from './questions.controller';
import { TopicsController } from './topics.controller';

@Module({
  controllers: [
    TopicsController,
    KnowledgeController,
    QuestionsController,
    AdminTopicsController,
    AdminKnowledgeController,
    AdminQuestionsController,
  ],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
