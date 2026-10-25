import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FEATURE_FLAG_EXAM_TRACK_AI,
  type FeatureFlagDto,
} from '@aps/shared';
import { PrismaService } from '../prisma/prisma.service';

function toDto(row: {
  key: string;
  enabled: boolean;
  updatedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
}): FeatureFlagDto {
  return {
    key: row.key,
    enabled: row.enabled,
    updatedBy: row.updatedBy,
    updatedAt: row.updatedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<FeatureFlagDto[]> {
    const rows = await this.prisma.featureFlag.findMany({
      orderBy: { key: 'asc' },
    });
    return rows.map(toDto);
  }

  async get(key: string): Promise<FeatureFlagDto> {
    const row = await this.prisma.featureFlag.findUnique({ where: { key } });
    if (!row) throw new NotFoundException(`Feature flag "${key}" not found`);
    return toDto(row);
  }

  /** Missing keys are treated as disabled (safe default for gates). */
  async isEnabled(key: string): Promise<boolean> {
    const row = await this.prisma.featureFlag.findUnique({ where: { key } });
    return row?.enabled === true;
  }

  async isExamTrackAiEnabled(): Promise<boolean> {
    return this.isEnabled(FEATURE_FLAG_EXAM_TRACK_AI);
  }

  async setEnabled(
    key: string,
    enabled: boolean,
    updatedBy?: string,
  ): Promise<FeatureFlagDto> {
    try {
      const row = await this.prisma.featureFlag.update({
        where: { key },
        data: {
          enabled,
          updatedBy: updatedBy ?? null,
        },
      });
      return toDto(row);
    } catch {
      throw new NotFoundException(`Feature flag "${key}" not found`);
    }
  }
}
