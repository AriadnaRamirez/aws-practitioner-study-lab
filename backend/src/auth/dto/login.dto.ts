import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email o username',
    example: 'admin@example.com',
  })
  @IsString()
  @MinLength(1, { message: 'Identificador requerido' })
  identifier!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Contraseña requerida' })
  password!: string;
}
