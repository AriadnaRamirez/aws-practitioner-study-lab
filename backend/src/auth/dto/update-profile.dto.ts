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
import { USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN } from '@aps/shared';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'ariadna',
    minLength: USERNAME_MIN,
    maxLength: USERNAME_MAX,
  })
  @IsOptional()
  @IsString()
  @MinLength(USERNAME_MIN, {
    message: `Usuario: mínimo ${USERNAME_MIN} caracteres`,
  })
  @MaxLength(USERNAME_MAX, {
    message: `Usuario: máximo ${USERNAME_MAX} caracteres`,
  })
  @Matches(USERNAME_PATTERN, {
    message: 'El usuario solo puede contener letras, números y _',
  })
  username?: string;

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
