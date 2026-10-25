import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AnswerFlashDto {
  @ApiProperty({ description: 'Id de aparición en cola (queueItemId)' })
  @IsString()
  queueItemId!: string;

  @ApiProperty({ enum: [0, 1, 2, 3] })
  @IsInt()
  @Min(0)
  @Max(3)
  @IsIn([0, 1, 2, 3])
  choiceIndex!: 0 | 1 | 2 | 3;

  @ApiPropertyOptional({ description: 'Latencia del intento en ms' })
  @IsOptional()
  @IsInt()
  @Min(0)
  latencyMs?: number;
}
