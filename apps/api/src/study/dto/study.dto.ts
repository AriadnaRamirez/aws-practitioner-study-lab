import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  STUDY_MODES,
  STUDY_SIZES,
  type StudyMode,
  type StudySize,
} from '@aps/shared';

export class StartStudySessionDto {
  @ApiProperty({ enum: STUDY_MODES })
  @IsIn([...STUDY_MODES])
  mode!: StudyMode;

  @ApiProperty({ enum: STUDY_SIZES })
  @IsInt()
  @IsIn([...STUDY_SIZES])
  size!: StudySize;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  topicIds?: string[];
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
}
