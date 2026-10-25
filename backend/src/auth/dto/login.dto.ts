import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

/**
 * Login acepta email o username. El campo canónico es `identifier`;
 * también se aceptan `login` y `email` (alias) para no romper clientes viejos.
 */
export class LoginDto {
  @ApiPropertyOptional({
    description: 'Email o username (preferido)',
    example: 'demo',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Identificador requerido' })
  identifier?: string;

  @ApiPropertyOptional({
    description: 'Alias de identifier',
    example: 'demo',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  login?: string;

  @ApiPropertyOptional({
    description: 'Alias de identifier (email)',
    example: 'demo@example.com',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  email?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Contraseña requerida' })
  password!: string;
}
