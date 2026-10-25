import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFeatureFlagDto {
  @ApiProperty({ description: 'Whether the flag is enabled' })
  @IsBoolean()
  enabled!: boolean;

  @ApiPropertyOptional({
    description: 'Who toggled the flag (username / actor id)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  updatedBy?: string;
}
