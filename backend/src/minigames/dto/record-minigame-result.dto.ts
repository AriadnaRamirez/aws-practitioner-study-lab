import { ApiProperty } from '@nestjs/swagger';
import {
  MINIGAME_RESULT_ID_MAX_LENGTH,
  type RecordMinigameResultRequest,
} from '@aps/shared';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class RecordMinigameResultDto implements RecordMinigameResultRequest {
  @ApiProperty({
    description: '`<gameId>` o `<gameId>:<topicId>` para juegos por tema',
    example: 'crucigrama:compute',
  })
  @IsString({ message: 'resultId es obligatorio' })
  @MaxLength(MINIGAME_RESULT_ID_MAX_LENGTH, {
    message: `resultId admite como máximo ${MINIGAME_RESULT_ID_MAX_LENGTH} caracteres`,
  })
  resultId!: string;

  @ApiProperty({ description: 'Terminado sin errores ni ayudas' })
  @IsBoolean({ message: 'perfect debe ser true o false' })
  perfect!: boolean;
}
