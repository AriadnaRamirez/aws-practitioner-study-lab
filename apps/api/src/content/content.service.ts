import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type ContentStatus,
  type ExamChoices,
  type ExamQuestion,
  type KnowledgeItem,
  type Topic,
} from '@aps/shared';
import { ContentStore } from './content.store';
import type {
  CreateExamQuestionDto,
  CreateKnowledgeItemDto,
  CreateTopicDto,
  UpdateExamQuestionDto,
  UpdateKnowledgeItemDto,
  UpdateTopicDto,
} from './dto/content.dto';

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function assertFourChoices(choices: string[]): asserts choices is ExamChoices {
  if (!Array.isArray(choices) || choices.length !== 4) {
    throw new BadRequestException('choices must contain exactly 4 strings');
  }
}

@Injectable()
export class ContentService {
  constructor(private readonly store: ContentStore) {}

  listTopics(): Topic[] {
    return [...this.store.topics.values()].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  getTopic(id: string): Topic {
    const topic = this.store.topics.get(id);
    if (!topic) throw new NotFoundException(`Topic ${id} not found`);
    return topic;
  }

  createTopic(dto: CreateTopicDto): Topic {
    const ts = nowIso();
    const topic: Topic = {
      id: newId('topic'),
      trackId: dto.trackId,
      type: dto.type,
      name: dto.name,
      parentId: dto.parentId ?? null,
      sortOrder: dto.sortOrder ?? 0,
      createdAt: ts,
      updatedAt: ts,
    };
    this.store.topics.set(topic.id, topic);
    return topic;
  }

  updateTopic(id: string, dto: UpdateTopicDto): Topic {
    const existing = this.getTopic(id);
    const updated: Topic = {
      ...existing,
      ...dto,
      id: existing.id,
      updatedAt: nowIso(),
    };
    this.store.topics.set(id, updated);
    return updated;
  }

  deleteTopic(id: string): void {
    this.getTopic(id);
    this.store.topics.delete(id);
  }

  listKnowledge(opts?: {
    publishedOnly?: boolean;
    topicId?: string;
  }): KnowledgeItem[] {
    let items = [...this.store.knowledge.values()];
    if (opts?.publishedOnly) {
      items = items.filter((i) => i.status === 'published');
    }
    if (opts?.topicId) {
      items = items.filter((i) => i.topicId === opts.topicId);
    }
    return items;
  }

  getKnowledge(id: string, opts?: { publishedOnly?: boolean }): KnowledgeItem {
    const item = this.store.knowledge.get(id);
    if (!item) throw new NotFoundException(`KnowledgeItem ${id} not found`);
    if (opts?.publishedOnly && item.status !== 'published') {
      throw new NotFoundException(`KnowledgeItem ${id} not found`);
    }
    return item;
  }

  createKnowledge(dto: CreateKnowledgeItemDto): KnowledgeItem {
    this.getTopic(dto.topicId);
    if (!dto.distractors || dto.distractors.length < 3) {
      throw new BadRequestException('distractors must have at least 3 entries');
    }
    const ts = nowIso();
    const item: KnowledgeItem = {
      id: newId('ki'),
      topicId: dto.topicId,
      trackId: dto.trackId,
      name: dto.name,
      definition: dto.definition,
      distractors: dto.distractors,
      explanation: dto.explanation,
      allowedVariants: dto.allowedVariants,
      status: dto.status,
      externalKey: dto.externalKey ?? null,
      createdAt: ts,
      updatedAt: ts,
    };
    this.store.knowledge.set(item.id, item);
    return item;
  }

  updateKnowledge(id: string, dto: UpdateKnowledgeItemDto): KnowledgeItem {
    const existing = this.getKnowledge(id);
    if (dto.topicId) this.getTopic(dto.topicId);
    if (dto.distractors && dto.distractors.length < 3) {
      throw new BadRequestException('distractors must have at least 3 entries');
    }
    const updated: KnowledgeItem = {
      ...existing,
      ...dto,
      id: existing.id,
      updatedAt: nowIso(),
    };
    this.store.knowledge.set(id, updated);
    return updated;
  }

  deleteKnowledge(id: string): void {
    this.getKnowledge(id);
    this.store.knowledge.delete(id);
  }

  listQuestions(opts?: {
    publishedOnly?: boolean;
    topicId?: string;
  }): ExamQuestion[] {
    let items = [...this.store.questions.values()];
    if (opts?.publishedOnly) {
      items = items.filter((i) => i.status === 'published');
    }
    if (opts?.topicId) {
      items = items.filter((i) => i.topicId === opts.topicId);
    }
    return items;
  }

  getQuestion(id: string, opts?: { publishedOnly?: boolean }): ExamQuestion {
    const item = this.store.questions.get(id);
    if (!item) throw new NotFoundException(`ExamQuestion ${id} not found`);
    if (opts?.publishedOnly && item.status !== 'published') {
      throw new NotFoundException(`ExamQuestion ${id} not found`);
    }
    return item;
  }

  createQuestion(dto: CreateExamQuestionDto): ExamQuestion {
    this.getTopic(dto.topicId);
    assertFourChoices(dto.choices);
    if (dto.correctIndex < 0 || dto.correctIndex > 3) {
      throw new BadRequestException('correctIndex must be 0..3');
    }
    const ts = nowIso();
    const item: ExamQuestion = {
      id: newId('eq'),
      topicId: dto.topicId,
      trackId: dto.trackId,
      stem: dto.stem,
      choices: dto.choices,
      correctIndex: dto.correctIndex,
      explanation: dto.explanation,
      status: dto.status,
      externalKey: dto.externalKey ?? null,
      createdAt: ts,
      updatedAt: ts,
    };
    this.store.questions.set(item.id, item);
    return item;
  }

  updateQuestion(id: string, dto: UpdateExamQuestionDto): ExamQuestion {
    const existing = this.getQuestion(id);
    if (dto.topicId) this.getTopic(dto.topicId);
    if (dto.choices) assertFourChoices(dto.choices);
    if (
      dto.correctIndex !== undefined &&
      (dto.correctIndex < 0 || dto.correctIndex > 3)
    ) {
      throw new BadRequestException('correctIndex must be 0..3');
    }
    const updated: ExamQuestion = {
      ...existing,
      ...dto,
      id: existing.id,
      choices: (dto.choices ?? existing.choices) as ExamChoices,
      status: (dto.status ?? existing.status) as ContentStatus,
      updatedAt: nowIso(),
    };
    this.store.questions.set(id, updated);
    return updated;
  }

  deleteQuestion(id: string): void {
    this.getQuestion(id);
    this.store.questions.delete(id);
  }
}
