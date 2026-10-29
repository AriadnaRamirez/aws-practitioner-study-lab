import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserExamDto, UpdateUserExamDto } from './dto/user-exam.dto';
import { parseExamDate, syncLegacyExamFromUser } from './exam-date.util';
import { UserExamsService } from './user-exams.service';

function row(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'ue_1',
    userId: 'user_1',
    examCode: 'CLF-C02',
    examDate: new Date('2026-11-07T00:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe('parseExamDate', () => {
  it('accepts a real civil date', () => {
    expect(parseExamDate('2026-11-07').toISOString().slice(0, 10)).toBe(
      '2026-11-07',
    );
  });

  it.each(['2026-02-30', '2026-13-01', '07/11/2026', '', 42])(
    'rejects %p',
    (value) => {
      expect(() => parseExamDate(value)).toThrow(BadRequestException);
    },
  );
});

describe('UserExam DTOs', () => {
  it('rejects unknown examCode with a Spanish message', async () => {
    const dto = plainToInstance(CreateUserExamDto, {
      examCode: 'SAA-C03',
      examDate: '2026-12-01',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(Object.values(errors[0].constraints ?? {})[0]).toMatch(
      /examCode desconocido/,
    );
  });

  it('rejects malformed examDate', async () => {
    const dto = plainToInstance(UpdateUserExamDto, { examDate: '1/12/2026' });
    const errors = await validate(dto);
    expect(Object.values(errors[0].constraints ?? {})).toContain(
      'examDate debe ser YYYY-MM-DD',
    );
  });

  it('accepts a catalog exam', async () => {
    const dto = plainToInstance(CreateUserExamDto, {
      examCode: 'AIF-C01',
      examDate: '2026-12-01',
    });
    await expect(validate(dto)).resolves.toHaveLength(0);
  });
});

describe('UserExamsService', () => {
  let prisma: {
    userExam: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    user: { update: jest.Mock };
    $transaction: jest.Mock;
  };
  let service: UserExamsService;

  beforeEach(() => {
    prisma = {
      userExam: {
        findMany: jest.fn(),
        findUnique: jest.fn().mockResolvedValue(null),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: { update: jest.fn() },
      $transaction: jest.fn(async (fn: (tx: unknown) => unknown) =>
        fn(prisma),
      ),
    };
    service = new UserExamsService(prisma as never);
  });

  it('lists own exams sorted by date and formats YYYY-MM-DD', async () => {
    prisma.userExam.findMany.mockResolvedValue([row()]);
    await expect(service.list('user_1')).resolves.toEqual([
      { id: 'ue_1', examCode: 'CLF-C02', examDate: '2026-11-07' },
    ]);
    expect(prisma.userExam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user_1' },
        orderBy: [{ examDate: 'asc' }, { examCode: 'asc' }],
      }),
    );
  });

  it('rejects unknown exam codes', async () => {
    await expect(
      service.create('user_1', {
        examCode: 'XYZ-01' as never,
        examDate: '2026-12-01',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.userExam.create).not.toHaveBeenCalled();
  });

  it('rejects invalid dates', async () => {
    await expect(
      service.create('user_1', { examCode: 'AIF-C01', examDate: '2026-02-31' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 409 when the exam is already scheduled', async () => {
    prisma.userExam.findUnique.mockResolvedValue(row({ examCode: 'AIF-C01' }));
    await expect(
      service.create('user_1', { examCode: 'AIF-C01', examDate: '2026-12-01' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('maps a unique-constraint race to 409', async () => {
    prisma.userExam.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('dup', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );
    await expect(
      service.create('user_1', { examCode: 'AIF-C01', examDate: '2026-12-01' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creating AIF-C01 does not touch legacy User.examDate', async () => {
    prisma.userExam.create.mockResolvedValue(
      row({ id: 'ue_2', examCode: 'AIF-C01', examDate: new Date('2026-12-01') }),
    );
    await expect(
      service.create('user_1', { examCode: 'AIF-C01', examDate: '2026-12-01' }),
    ).resolves.toEqual({
      id: 'ue_2',
      examCode: 'AIF-C01',
      examDate: '2026-12-01',
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('creating CLF-C02 mirrors the date into User.examDate', async () => {
    prisma.userExam.create.mockResolvedValue(row());
    await service.create('user_1', {
      examCode: 'CLF-C02',
      examDate: '2026-11-07',
    });
    const call = prisma.user.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'user_1' });
    expect(call.data.examDate.toISOString().slice(0, 10)).toBe('2026-11-07');
  });

  it('updating CLF-C02 mirrors the new date', async () => {
    prisma.userExam.findFirst.mockResolvedValue(row());
    prisma.userExam.update.mockResolvedValue(
      row({ examDate: new Date('2026-11-20') }),
    );
    const result = await service.update('user_1', 'ue_1', {
      examDate: '2026-11-20',
    });
    expect(result.examDate).toBe('2026-11-20');
    expect(
      prisma.user.update.mock.calls[0][0].data.examDate
        .toISOString()
        .slice(0, 10),
    ).toBe('2026-11-20');
  });

  it('cannot update or delete exams owned by someone else', async () => {
    prisma.userExam.findFirst.mockResolvedValue(null);
    await expect(
      service.update('user_1', 'ue_other', { examDate: '2026-11-20' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.remove('user_1', 'ue_other')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.userExam.findFirst).toHaveBeenCalledWith({
      where: { id: 'ue_other', userId: 'user_1' },
    });
    expect(prisma.userExam.delete).not.toHaveBeenCalled();
  });

  it('deleting CLF-C02 clears User.examDate', async () => {
    prisma.userExam.findFirst.mockResolvedValue(row());
    await expect(service.remove('user_1', 'ue_1')).resolves.toEqual({
      id: 'ue_1',
      deleted: true,
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user_1' },
      data: { examDate: null },
    });
  });

  it('deleting AIF-C01 leaves User.examDate alone', async () => {
    prisma.userExam.findFirst.mockResolvedValue(row({ examCode: 'AIF-C01' }));
    await service.remove('user_1', 'ue_1');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

describe('syncLegacyExamFromUser', () => {
  const tx = {
    userExam: { upsert: jest.fn(), deleteMany: jest.fn() },
  };

  beforeEach(() => jest.clearAllMocks());

  it('upserts the CLF-C02 exam when a legacy date is set', async () => {
    const date = new Date('2026-11-07T12:00:00.000Z');
    await syncLegacyExamFromUser(tx as never, 'user_1', date);
    expect(tx.userExam.upsert).toHaveBeenCalledWith({
      where: { userId_examCode: { userId: 'user_1', examCode: 'CLF-C02' } },
      create: { userId: 'user_1', examCode: 'CLF-C02', examDate: date },
      update: { examDate: date },
    });
  });

  it('removes the CLF-C02 exam when the legacy date is cleared', async () => {
    await syncLegacyExamFromUser(tx as never, 'user_1', null);
    expect(tx.userExam.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user_1', examCode: 'CLF-C02' },
    });
    expect(tx.userExam.upsert).not.toHaveBeenCalled();
  });
});
