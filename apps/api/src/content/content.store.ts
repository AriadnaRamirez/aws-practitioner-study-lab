import { Injectable } from '@nestjs/common';
import type { ExamQuestion, KnowledgeItem, Topic } from '@aps/shared';
import {
  buildSeedKnowledge,
  buildSeedQuestions,
  buildSeedTopics,
} from './content.seed';

/**
 * In-memory content repository (APS-6).
 * APS-7 will swap this for Prisma without changing controller routes.
 */
@Injectable()
export class ContentStore {
  readonly topics: Map<string, Topic> = new Map();
  readonly knowledge: Map<string, KnowledgeItem> = new Map();
  readonly questions: Map<string, ExamQuestion> = new Map();

  constructor() {
    for (const t of buildSeedTopics()) this.topics.set(t.id, t);
    for (const k of buildSeedKnowledge()) this.knowledge.set(k.id, k);
    for (const q of buildSeedQuestions()) this.questions.set(q.id, q);
  }
}
