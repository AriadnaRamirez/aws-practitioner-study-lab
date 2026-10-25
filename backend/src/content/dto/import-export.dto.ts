import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RunImportDto {
  @ApiProperty({
    enum: ['json', 'csv'],
    description: 'Payload format',
    example: 'json',
  })
  @IsIn(['json', 'csv'])
  format!: 'json' | 'csv';

  @ApiProperty({
    description:
      'Raw JSON bundle or CSV text. JSON: { topics?, knowledgeItems?, examQuestions? } or a mixed array with kind.',
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional({
    description: 'When true, validate and report actions without mutating store',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;

  @ApiPropertyOptional({ description: 'Original filename for job history' })
  @IsOptional()
  @IsString()
  filename?: string;
}
