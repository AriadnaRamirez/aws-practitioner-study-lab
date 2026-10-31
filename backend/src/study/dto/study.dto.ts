import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  EXAM_TIMED_SIZES,
  STUDY_MODES,
  type SessionSize,
  type StudyMode,
} from '@aps/shared';

const ALL_SIZES = [...EXAM_TIMED_SIZES] as number[];

export class ListLimitQueryDto {
  @ApiPropertyOptional({ default: 50, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

export class StartWeakReviewDto {
  @ApiPropertyOptional({
    description: 'Máximo de ítems en la cola (default: todos, tope 50)',
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class StartStudySessionDto {
  @ApiProperty({ enum: STUDY_MODES })
  @IsIn([...STUDY_MODES])
  mode!: StudyMode;

  @ApiProperty({
    enum: EXAM_TIMED_SIZES,
    description:
      'FLASH_STUDY / EXAM_STUDY: 10–50. EXAM_TIMED: también 65 (mock).',
  })
  @IsInt()
  @IsIn(ALL_SIZES)
  size!: SessionSize;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  topicIds?: string[];

  @ApiPropertyOptional({ example: 'America/Mexico_City' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description:
      'FLASH_STUDY: reparte las cartas por igual entre topicIds (partida rápida)',
  })
  @IsOptional()
  @IsBoolean()
  balanced?: boolean;
}

export class AnswerStudyDto {
  @ApiProperty({ description: 'queueItemId of the current prompt' })
  @IsString()
  queueItemId!: string;

  @ApiProperty({ minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  choiceIndex!: 0 | 1 | 2 | 3;

  @ApiPropertyOptional({ description: 'Client latency hint (FLASH_STUDY)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  latencyMs?: number;
}

export class AnswerExamTimedDto {
  @ApiProperty()
  @IsString()
  questionId!: string;

  @ApiProperty({ minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  choiceIndex!: 0 | 1 | 2 | 3;
}

export class MarkReviewDto {
  @ApiProperty()
  @IsString()
  questionId!: string;

  @ApiProperty()
  @IsBoolean()
  marked!: boolean;
}
