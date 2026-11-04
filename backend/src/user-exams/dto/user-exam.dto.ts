import { ApiProperty } from '@nestjs/swagger';
import { EXAM_CODES, type ExamCode } from '@aps/shared';
import { IsIn, IsString, Matches } from 'class-validator';
import { EXAM_DATE_PATTERN } from '../exam-date.util';

export class CreateUserExamDto {
  @ApiProperty({ enum: EXAM_CODES, example: 'AIF-C01' })
  @IsString({ message: 'examCode es obligatorio' })
  @IsIn(EXAM_CODES, {
    message: `examCode desconocido. Usa: ${EXAM_CODES.join(' | ')}`,
  })
  examCode!: ExamCode;

  @ApiProperty({ description: 'Fecha del examen (YYYY-MM-DD)', example: '2026-12-15' })
  @IsString({ message: 'examDate es obligatorio' })
  @Matches(EXAM_DATE_PATTERN, { message: 'examDate debe ser YYYY-MM-DD' })
  examDate!: string;
}

export class UpdateUserExamDto {
  @ApiProperty({ description: 'Fecha del examen (YYYY-MM-DD)', example: '2026-12-15' })
  @IsString({ message: 'examDate es obligatorio' })
  @Matches(EXAM_DATE_PATTERN, { message: 'examDate debe ser YYYY-MM-DD' })
  examDate!: string;
}
