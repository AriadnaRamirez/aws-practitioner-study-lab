import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'America/Mexico_City' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  podiumHidden?: boolean;

  @ApiPropertyOptional({
    description: 'Fecha del examen (YYYY-MM-DD) o null para borrar',
    example: '2026-11-16',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'examDate debe ser YYYY-MM-DD',
  })
  examDate?: string | null;
}
