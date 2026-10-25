import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type ContentStatus,
  type ExamChoices,
  type ExamQuestion,
  type FlashVariant,
  type KnowledgeItem,
  type Topic,
  type TopicType,
} from '@aps/shared';
import type {
  ContentStatus as PrismaContentStatus,
  ExamQuestion as PrismaExamQuestion,
  KnowledgeItem as PrismaKnowledgeItem,
  Topic as PrismaTopic,
  TopicType as PrismaTopicType,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateExamQuestionDto,
  CreateKnowledgeItemDto,
  CreateTopicDto,
  UpdateExamQuestionDto,
  UpdateKnowledgeItemDto,
  UpdateTopicDto,
} from './dto/content.dto';

function assertFourChoices(choices: string[]): asserts choices is ExamChoices {
  if (!Array.isArray(choices) || choices.length !== 4) {
    throw new BadRequestException('choices must contain exactly 4 strings');
  }
}

function asStringArray(value: Prisma.JsonValue, field: string): string[] {
  if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
    throw new BadRequestException(`${field} must be a JSON string array`);
  }
  return value as string[];
}

function toIso(d: Date): string {
  return d.toISOString();
}

function mapTopic(row: PrismaTopic): Topic {
  return {
    id: row.id,
    trackId: row.trackId,
    type: row.type as TopicType,
    name: row.name,
    parentId: row.parentId,
    sortOrder: row.sortOrder,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function mapKnowledge(row: PrismaKnowledgeItem): KnowledgeItem {
  return {
    id: row.id,
    topicId: row.topicId,
    trackId: row.trackId,
    name: row.name,
    definition: row.definition,
    distractors: asStringArray(row.distractors, 'distractors'),
    explanation: row.explanation,
    allowedVariants: asStringArray(
      row.allowedVariants,
      'allowedVariants',
    ) as FlashVariant[],
    status: row.status as ContentStatus,
    externalKey: row.externalKey,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function mapQuestion(row: PrismaExamQuestion): ExamQuestion {
  const choices = asStringArray(row.choices, 'choices');
  assertFourChoices(choices);
  const correctIndex = row.correctIndex;
  if (correctIndex < 0 || correctIndex > 3) {
    throw new BadRequestException('correctIndex must be 0..3');
  }
  return {
    id: row.id,
    topicId: row.topicId,
    trackId: row.trackId,
    stem: row.stem,
    choices,
    correctIndex: correctIndex as 0 | 1 | 2 | 3,
    explanation: row.explanation,
    status: row.status as ContentStatus,
    externalKey: row.externalKey,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async listTopics(): Promise<Topic[]> {
    const rows = await this.prisma.topic.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map(mapTopic);
  }

  async getTopic(id: string): Promise<Topic> {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException(`Topic ${id} not found`);
    return mapTopic(topic);
  }

  async createTopic(dto: CreateTopicDto): Promise<Topic> {
    if (dto.parentId) {
      await this.getTopic(dto.parentId);
    }
    const row = await this.prisma.topic.create({
      data: {
        trackId: dto.trackId,
        type: dto.type as PrismaTopicType,
        name: dto.name,
        parentId: dto.parentId ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
    return mapTopic(row);
  }

  async updateTopic(id: string, dto: UpdateTopicDto): Promise<Topic> {
    await this.getTopic(id);
    if (dto.parentId) {
      await this.getTopic(dto.parentId);
    }
    const row = await this.prisma.topic.update({
      where: { id },
      data: {
        ...(dto.trackId !== undefined ? { trackId: dto.trackId } : {}),
        ...(dto.type !== undefined
          ? { type: dto.type as PrismaTopicType }
          : {}),
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.parentId !== undefined ? { parentId: dto.parentId } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
    return mapTopic(row);
  }

  async deleteTopic(id: string): Promise<void> {
    await this.getTopic(id);
    await this.prisma.topic.delete({ where: { id } });
  }

  async listKnowledge(opts?: {
    publishedOnly?: boolean;
    topicId?: string;
  }): Promise<KnowledgeItem[]> {
    const rows = await this.prisma.knowledgeItem.findMany({
      where: {
        ...(opts?.publishedOnly ? { status: 'published' } : {}),
        ...(opts?.topicId ? { topicId: opts.topicId } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(mapKnowledge);
  }

  async getKnowledge(
    id: string,
    opts?: { publishedOnly?: boolean },
  ): Promise<KnowledgeItem> {
    const item = await this.prisma.knowledgeItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`KnowledgeItem ${id} not found`);
    if (opts?.publishedOnly && item.status !== 'published') {
      throw new NotFoundException(`KnowledgeItem ${id} not found`);
    }
    return mapKnowledge(item);
  }

  async createKnowledge(dto: CreateKnowledgeItemDto): Promise<KnowledgeItem> {
    await this.getTopic(dto.topicId);
    if (!dto.distractors || dto.distractors.length < 3) {
      throw new BadRequestException('distractors must have at least 3 entries');
    }
    const row = await this.prisma.knowledgeItem.create({
      data: {
        topicId: dto.topicId,
        trackId: dto.trackId,
        name: dto.name,
        definition: dto.definition,
        distractors: dto.distractors,
        explanation: dto.explanation,
        allowedVariants: dto.allowedVariants,
        status: dto.status as PrismaContentStatus,
        externalKey: dto.externalKey ?? null,
      },
    });
    return mapKnowledge(row);
  }

  async updateKnowledge(
    id: string,
    dto: UpdateKnowledgeItemDto,
  ): Promise<KnowledgeItem> {
    await this.getKnowledge(id);
    if (dto.topicId) await this.getTopic(dto.topicId);
    if (dto.distractors && dto.distractors.length < 3) {
      throw new BadRequestException('distractors must have at least 3 entries');
    }
    const row = await this.prisma.knowledgeItem.update({
      where: { id },
      data: {
        ...(dto.topicId !== undefined ? { topicId: dto.topicId } : {}),
        ...(dto.trackId !== undefined ? { trackId: dto.trackId } : {}),
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.definition !== undefined ? { definition: dto.definition } : {}),
        ...(dto.distractors !== undefined
          ? { distractors: dto.distractors }
          : {}),
        ...(dto.explanation !== undefined
          ? { explanation: dto.explanation }
          : {}),
        ...(dto.allowedVariants !== undefined
          ? { allowedVariants: dto.allowedVariants }
          : {}),
        ...(dto.status !== undefined
          ? { status: dto.status as PrismaContentStatus }
          : {}),
        ...(dto.externalKey !== undefined
          ? { externalKey: dto.externalKey }
          : {}),
      },
    });
    return mapKnowledge(row);
  }

  async deleteKnowledge(id: string): Promise<void> {
    await this.getKnowledge(id);
    await this.prisma.knowledgeItem.delete({ where: { id } });
  }

  async listQuestions(opts?: {
    publishedOnly?: boolean;
    topicId?: string;
  }): Promise<ExamQuestion[]> {
    const rows = await this.prisma.examQuestion.findMany({
      where: {
        ...(opts?.publishedOnly ? { status: 'published' } : {}),
        ...(opts?.topicId ? { topicId: opts.topicId } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(mapQuestion);
  }

  async getQuestion(
    id: string,
    opts?: { publishedOnly?: boolean },
  ): Promise<ExamQuestion> {
    const item = await this.prisma.examQuestion.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`ExamQuestion ${id} not found`);
    if (opts?.publishedOnly && item.status !== 'published') {
      throw new NotFoundException(`ExamQuestion ${id} not found`);
    }
    return mapQuestion(item);
  }

  async createQuestion(dto: CreateExamQuestionDto): Promise<ExamQuestion> {
    await this.getTopic(dto.topicId);
    assertFourChoices(dto.choices);
    if (dto.correctIndex < 0 || dto.correctIndex > 3) {
      throw new BadRequestException('correctIndex must be 0..3');
    }
    const row = await this.prisma.examQuestion.create({
      data: {
        topicId: dto.topicId,
        trackId: dto.trackId,
        stem: dto.stem,
        choices: dto.choices,
        correctIndex: dto.correctIndex,
        explanation: dto.explanation,
        status: dto.status as PrismaContentStatus,
        externalKey: dto.externalKey ?? null,
      },
    });
    return mapQuestion(row);
  }

  async updateQuestion(
    id: string,
    dto: UpdateExamQuestionDto,
  ): Promise<ExamQuestion> {
    await this.getQuestion(id);
    if (dto.topicId) await this.getTopic(dto.topicId);
    if (dto.choices) assertFourChoices(dto.choices);
    if (
      dto.correctIndex !== undefined &&
      (dto.correctIndex < 0 || dto.correctIndex > 3)
    ) {
      throw new BadRequestException('correctIndex must be 0..3');
    }
    const row = await this.prisma.examQuestion.update({
      where: { id },
      data: {
        ...(dto.topicId !== undefined ? { topicId: dto.topicId } : {}),
        ...(dto.trackId !== undefined ? { trackId: dto.trackId } : {}),
        ...(dto.stem !== undefined ? { stem: dto.stem } : {}),
        ...(dto.choices !== undefined ? { choices: dto.choices } : {}),
        ...(dto.correctIndex !== undefined
          ? { correctIndex: dto.correctIndex }
          : {}),
        ...(dto.explanation !== undefined
          ? { explanation: dto.explanation }
          : {}),
        ...(dto.status !== undefined
          ? { status: dto.status as PrismaContentStatus }
          : {}),
        ...(dto.externalKey !== undefined
          ? { externalKey: dto.externalKey }
          : {}),
      },
    });
    return mapQuestion(row);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.getQuestion(id);
    await this.prisma.examQuestion.delete({ where: { id } });
  }
}
