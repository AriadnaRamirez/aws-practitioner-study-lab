import { BadRequestException } from '@nestjs/common';
import { LEGACY_EXAM_CODE } from '@aps/shared';
import type { Prisma } from '@prisma/client';

export const EXAM_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses a civil `YYYY-MM-DD` into a Date for a `@db.Date` column.
 * Rejects impossible calendar days (e.g. 2026-02-30) that `new Date` would roll over.
 */
export function parseExamDate(raw: unknown): Date {
  if (typeof raw !== 'string' || !EXAM_DATE_PATTERN.test(raw.trim())) {
    throw new BadRequestException('examDate debe ser YYYY-MM-DD');
  }
  const value = raw.trim();
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new BadRequestException('examDate no es una fecha válida');
  }
  return parsed;
}

export function formatExamDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Mirrors the legacy `User.examDate` into the user's CLF-C02 UserExam
 * (upsert when set, delete when cleared). Run inside the same transaction
 * as the `User.examDate` write.
 */
export async function syncLegacyExamFromUser(
  tx: Prisma.TransactionClient,
  userId: string,
  examDate: Date | null,
): Promise<void> {
  if (examDate) {
    await tx.userExam.upsert({
      where: { userId_examCode: { userId, examCode: LEGACY_EXAM_CODE } },
      create: { userId, examCode: LEGACY_EXAM_CODE, examDate },
      update: { examDate },
    });
  } else {
    await tx.userExam.deleteMany({
      where: { userId, examCode: LEGACY_EXAM_CODE },
    });
  }
}
