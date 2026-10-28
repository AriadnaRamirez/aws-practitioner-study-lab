import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'estudiante@example.com' })
  @IsEmail({}, { message: 'Correo inválido' })
  email!: string;
}
