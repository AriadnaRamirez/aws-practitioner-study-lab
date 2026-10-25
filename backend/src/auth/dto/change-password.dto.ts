import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN } from '@aps/shared';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(PASSWORD_MIN)
  password!: string;

  @ApiProperty()
  @IsString()
  @MinLength(PASSWORD_MIN)
  confirmPassword!: string;
}
