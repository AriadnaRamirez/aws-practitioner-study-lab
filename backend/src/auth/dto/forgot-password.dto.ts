import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'estudiante@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;
}
