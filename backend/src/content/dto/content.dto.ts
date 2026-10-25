import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
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
  @IsString()
  @MinLength(1)
  trackId!: string;

  @ApiProperty({ enum: TOPIC_TYPES, example: 'SERVICE' })
  @IsIn([...TOPIC_TYPES])
  type!: TopicType;

  @ApiProperty({ example: 'Redes' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string | null;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}

export class CreateKnowledgeItemDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  topicId!: string;

  @ApiProperty({ example: 'CLF' })
  @IsString()
  @MinLength(1)
  trackId!: string;

  @ApiProperty({ example: 'IAM' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  definition!: string;

  @ApiProperty({ type: [String], minItems: 3 })
  @IsArray()
  @ArrayMinSize(3)
  @IsString({ each: true })
  distractors!: string[];

  @ApiProperty()
  @IsString()
  @MinLength(1)
  explanation!: string;

  @ApiProperty({ enum: FLASH_VARIANTS, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsIn([...FLASH_VARIANTS], { each: true })
  allowedVariants!: FlashVariant[];

  @ApiProperty({ enum: CONTENT_STATUSES, example: 'draft' })
  @IsIn([...CONTENT_STATUSES])
  status!: ContentStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  externalKey?: string | null;
}

export class UpdateKnowledgeItemDto extends PartialType(
  CreateKnowledgeItemDto,
) {}

export class CreateExamQuestionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  topicId!: string;

  @ApiProperty({ example: 'CLF' })
  @IsString()
  @MinLength(1)
  trackId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  stem!: string;

  @ApiProperty({
    type: [String],
    minItems: 4,
    maxItems: 4,
    example: ['A', 'B', 'C', 'D'],
  })
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  choices!: ExamChoices;

  @ApiProperty({ minimum: 0, maximum: 3, example: 0 })
  @IsInt()
  @Min(0)
  @Max(3)
  correctIndex!: 0 | 1 | 2 | 3;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  explanation!: string;

  @ApiProperty({ enum: CONTENT_STATUSES, example: 'draft' })
  @IsIn([...CONTENT_STATUSES])
  status!: ContentStatus;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  externalKey?: string | null;
}

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) {}
