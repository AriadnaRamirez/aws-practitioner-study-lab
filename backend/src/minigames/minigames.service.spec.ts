import { BadRequestException } from '@nestjs/common';
import { isMinigameResultId } from '@aps/shared';
import { MinigameStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RecordMinigameResultDto } from './dto/record-minigame-result.dto';
import { MinigamesService } from './minigames.service';

describe('isMinigameResultId', () => {
  it.each(['crucigrama', 'crucigrama:cloud-concepts'])(
    'accepts %p',
    (id) => {
      expect(isMinigameResultId(id)).toBe(true);
    },
  );

  it.each([
    '',
    'memorama',
    'cuanto-pagas',
    'quien-se-encarga',
    'pieza-que-falta',
    'como-se-conecta',
    'cloud-architect',
    'crucigrama:',
    'crucigrama:Compute',
    'crucigrama:a:b',
    'crucigrama:<script>',
    `crucigrama:${'a'.repeat(80)}`,
  ])('rejects %p', (id) => {
    expect(isMinigameResultId(id)).toBe(false);
  });
});

describe('RecordMinigameResultDto', () => {
  it('requires a boolean perfect flag', async () => {
    const dto = plainToInstance(RecordMinigameResultDto, {
      resultId: 'crucigrama',
      perfect: 'yes',
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toEqual(['perfect']);
  });
});

describe('MinigamesService', () => {
  const prisma = {
    minigameResult: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  };
  const service = new MinigamesService(prisma as never);

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.minigameResult.findMany.mockResolvedValue([
      { resultId: 'crucigrama', status: MinigameStatus.COMPLETED },
      { resultId: 'crucigrama:compute', status: MinigameStatus.PLAYED },
    ]);
  });

  it('lists the user tags in API casing', async () => {
    await expect(service.list('user_1')).resolves.toEqual({
      crucigrama: 'completed',
      'crucigrama:compute': 'played',
    });
    expect(prisma.minigameResult.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user_1' } }),
    );
  });

  it('marks a perfect run as completed', async () => {
    await service.record('user_1', { resultId: 'crucigrama', perfect: true });
    expect(prisma.minigameResult.upsert).toHaveBeenCalledWith({
      where: {
        userId_resultId: { userId: 'user_1', resultId: 'crucigrama' },
      },
      create: {
        userId: 'user_1',
        resultId: 'crucigrama',
        status: MinigameStatus.COMPLETED,
      },
      update: { status: MinigameStatus.COMPLETED },
    });
  });

  it('never downgrades: an imperfect run only creates a played row', async () => {
    const results = await service.record('user_1', {
      resultId: 'crucigrama',
      perfect: false,
    });
    expect(prisma.minigameResult.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          status: MinigameStatus.PLAYED,
        }) as unknown,
        update: {},
      }),
    );
    expect(results.crucigrama).toBe('completed');
  });

  it('rejects unknown games before touching the database', async () => {
    await expect(
      service.record('user_1', { resultId: 'memorama', perfect: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.minigameResult.upsert).not.toHaveBeenCalled();
  });
});
