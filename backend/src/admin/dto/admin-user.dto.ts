import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ description: 'Ocultar del podio público' })
  @IsOptional()
  @IsBoolean()
  podiumHidden?: boolean;

  @ApiPropertyOptional({
    description: 'true = soft-ban (no login); false = rehabilitar',
  })
  @IsOptional()
  @IsBoolean()
  banned?: boolean;
}
