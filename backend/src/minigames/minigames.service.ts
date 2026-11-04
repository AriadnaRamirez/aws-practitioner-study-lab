import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MINIGAME_IDS,
  isMinigameResultId,
  type MinigameResults,
  type RecordMinigameResultRequest,
} from '@aps/shared';
import { MinigameStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const TO_DTO = {
  [MinigameStatus.PLAYED]: 'played',
  [MinigameStatus.COMPLETED]: 'completed',
} as const;

@Injectable()
export class MinigamesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<MinigameResults> {
    const rows = await this.prisma.minigameResult.findMany({
      where: { userId },
      select: { resultId: true, status: true },
    });
    return Object.fromEntries(
      rows.map((row) => [row.resultId, TO_DTO[row.status]]),
    );
  }

  async record(
    userId: string,
    dto: RecordMinigameResultRequest,
  ): Promise<MinigameResults> {
    if (!isMinigameResultId(dto.resultId)) {
      throw new BadRequestException(
        `resultId desconocido. Usa ${MINIGAME_IDS.join(' | ')} o <juego>:<tema>`,
      );
    }
    const status = dto.perfect
      ? MinigameStatus.COMPLETED
      : MinigameStatus.PLAYED;
    await this.prisma.minigameResult.upsert({
      where: { userId_resultId: { userId, resultId: dto.resultId } },
      create: { userId, resultId: dto.resultId, status },
      // An imperfect run leaves the row as is, so COMPLETED never drops back to PLAYED.
      update: dto.perfect ? { status } : {},
    });
    return this.list(userId);
  }
}
