import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EXAM_CODES,
  LEGACY_EXAM_CODE,
  getExamCatalogEntry,
  isExamCode,
  type CreateUserExamRequest,
  type DeleteUserExamResponse,
  type ExamCode,
  type UpdateUserExamRequest,
  type UserExam,
} from '@aps/shared';
import { Prisma, type UserExam as UserExamRow } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { formatExamDate, parseExamDate } from './exam-date.util';

@Injectable()
export class UserExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<UserExam[]> {
    const rows = await this.prisma.userExam.findMany({
      where: { userId },
      orderBy: [{ examDate: 'asc' }, { examCode: 'asc' }],
    });
    return rows.map((row) => this.toDto(row));
  }

  async create(userId: string, dto: CreateUserExamRequest): Promise<UserExam> {
    if (!isExamCode(dto.examCode)) {
      throw new BadRequestException(
        `examCode desconocido. Usa: ${EXAM_CODES.join(' | ')}`,
      );
    }
    const examCode = dto.examCode;
    const examDate = parseExamDate(dto.examDate);

    const existing = await this.prisma.userExam.findUnique({
      where: { userId_examCode: { userId, examCode } },
    });
    if (existing) {
      throw this.duplicateError(examCode);
    }

    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const created = await tx.userExam.create({
          data: { userId, examCode, examDate },
        });
        if (examCode === LEGACY_EXAM_CODE) {
          await tx.user.update({ where: { id: userId }, data: { examDate } });
        }
        return created;
      });
      return this.toDto(row);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw this.duplicateError(examCode);
      }
      throw err;
    }
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateUserExamRequest,
  ): Promise<UserExam> {
    const examDate = parseExamDate(dto.examDate);
    const current = await this.findOwned(userId, id);

    const row = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.userExam.update({
        where: { id: current.id },
        data: { examDate },
      });
      if (current.examCode === LEGACY_EXAM_CODE) {
        await tx.user.update({ where: { id: userId }, data: { examDate } });
      }
      return updated;
    });
    return this.toDto(row);
  }

  async remove(userId: string, id: string): Promise<DeleteUserExamResponse> {
    const current = await this.findOwned(userId, id);

    await this.prisma.$transaction(async (tx) => {
      await tx.userExam.delete({ where: { id: current.id } });
      if (current.examCode === LEGACY_EXAM_CODE) {
        await tx.user.update({
          where: { id: userId },
          data: { examDate: null },
        });
      }
    });
    return { id: current.id, deleted: true };
  }

  private async findOwned(userId: string, id: string): Promise<UserExamRow> {
    const row = await this.prisma.userExam.findFirst({
      where: { id, userId },
    });
    if (!row) {
      throw new NotFoundException('Examen no encontrado');
    }
    return row;
  }

  private duplicateError(examCode: ExamCode) {
    return new ConflictException(
      `Ya tienes programado ${getExamCatalogEntry(examCode).name} (${examCode}). Edita su fecha en lugar de crearlo de nuevo.`,
    );
  }

  private toDto(row: UserExamRow): UserExam {
    return {
      id: row.id,
      examCode: row.examCode as ExamCode,
      examDate: formatExamDate(row.examDate),
    };
  }
}
