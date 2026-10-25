import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { STUDY_SIZES, type StudySize } from '@aps/shared';

export class StartFlashSessionDto {
  @ApiProperty({ enum: ['FLASH_STUDY'], example: 'FLASH_STUDY' })
  @IsIn(['FLASH_STUDY'])
  mode!: 'FLASH_STUDY';

  @ApiProperty({ enum: STUDY_SIZES, example: 10 })
  @IsIn([...STUDY_SIZES])
  size!: StudySize;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filtro de temas; vacío/omitido = mixto (todo el banco)',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  topicIds?: string[];
}
