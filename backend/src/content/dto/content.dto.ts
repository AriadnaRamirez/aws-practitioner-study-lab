import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  CONTENT_STATUSES,
  FLASH_VARIANTS,
  TOPIC_TYPES,
  type ContentStatus,
  type ExamChoices,
  type FlashVariant,
  type TopicType,
} from '@aps/shared';

export class CreateTopicDto {
  @ApiProperty({ example: 'CLF' })
  trackId!: string;

  @ApiProperty({ enum: TOPIC_TYPES, example: 'SERVICE' })
  type!: TopicType;

  @ApiProperty({ example: 'Redes' })
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  parentId?: string | null;

  @ApiPropertyOptional({ example: 40 })
  sortOrder?: number;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}

export class CreateKnowledgeItemDto {
  @ApiProperty()
  topicId!: string;

  @ApiProperty({ example: 'CLF' })
  trackId!: string;

  @ApiProperty({ example: 'IAM' })
  name!: string;

  @ApiProperty()
  definition!: string;

  @ApiProperty({ type: [String], minItems: 3 })
  distractors!: string[];

  @ApiProperty()
  explanation!: string;

  @ApiProperty({ enum: FLASH_VARIANTS, isArray: true })
  allowedVariants!: FlashVariant[];

  @ApiProperty({ enum: CONTENT_STATUSES, example: 'draft' })
  status!: ContentStatus;

  @ApiPropertyOptional({ nullable: true })
  externalKey?: string | null;
}

export class UpdateKnowledgeItemDto extends PartialType(
  CreateKnowledgeItemDto,
) {}

export class CreateExamQuestionDto {
  @ApiProperty()
  topicId!: string;

  @ApiProperty({ example: 'CLF' })
  trackId!: string;

  @ApiProperty()
  stem!: string;

  @ApiProperty({
    type: [String],
    minItems: 4,
    maxItems: 4,
    example: ['A', 'B', 'C', 'D'],
  })
  choices!: ExamChoices;

  @ApiProperty({ minimum: 0, maximum: 3, example: 0 })
  correctIndex!: 0 | 1 | 2 | 3;

  @ApiProperty()
  explanation!: string;

  @ApiProperty({ enum: CONTENT_STATUSES, example: 'draft' })
  status!: ContentStatus;

  @ApiPropertyOptional({ nullable: true })
  externalKey?: string | null;
}

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) {}
