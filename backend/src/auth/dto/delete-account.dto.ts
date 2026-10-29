import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({ description: 'Contraseña actual, para confirmar' })
  @IsString()
  @MinLength(1)
  password!: string;
}
