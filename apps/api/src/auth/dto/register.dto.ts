import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN } from '@aps/shared';

export class RegisterDto {
  @ApiProperty({ example: 'estudiante@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @ApiProperty({ example: 'ariadna', minLength: USERNAME_MIN, maxLength: USERNAME_MAX })
  @IsString()
  @MinLength(USERNAME_MIN, { message: `Username mínimo ${USERNAME_MIN} caracteres` })
  @MaxLength(USERNAME_MAX, { message: `Username máximo ${USERNAME_MAX} caracteres` })
  @Matches(USERNAME_PATTERN, {
    message: 'Username solo puede contener letras, números y _',
  })
  username!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Debe coincidir con password' })
  @IsString()
  confirmPassword!: string;

  @ApiPropertyOptional({ example: 'America/Mexico_City' })
  @IsOptional()
  @IsString()
  timezone?: string;
}
