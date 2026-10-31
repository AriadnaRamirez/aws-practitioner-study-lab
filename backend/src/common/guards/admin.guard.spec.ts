import { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import request from 'supertest';
import { App } from 'supertest/types';
import { AdminUsageController } from '../../admin/admin-usage.controller';
import { AdminUsageService } from '../../admin/admin-usage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard, configuredStaticAdminToken } from './admin.guard';

const JWT_SECRET = 'test-jwt-secret';
const STRONG_TOKEN = 'a'.repeat(16) + 'b'.repeat(16);

const USERS = {
  admin: { id: 'u-admin', role: Role.ADMIN, bannedAt: null },
  student: { id: 'u-student', role: Role.STUDENT, bannedAt: null },
  bannedAdmin: { id: 'u-banned', role: Role.ADMIN, bannedAt: new Date() },
};

describe('AdminGuard (GET /admin/users)', () => {
  let app: INestApplication<App>;
  let jwt: JwtService;
  const envBackup = {
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  const prisma = {
    user: {
      findUnique: jest.fn(({ where }: { where: { id: string } }) =>
        Promise.resolve(
          Object.values(USERS).find((u) => u.id === where.id) ?? null,
        ),
      ),
    },
  };
  const usage = { listUsers: jest.fn(() => [{ id: 'u-student' }]) };

  const tokenFor = (id: string) => jwt.sign({ sub: id });
  const getUsers = () => request(app.getHttpServer()).get('/admin/users');

  beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      controllers: [AdminUsageController],
      providers: [
        AdminGuard,
        { provide: PrismaService, useValue: prisma },
        { provide: AdminUsageService, useValue: usage },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    jwt = moduleRef.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
    for (const [key, value] of Object.entries(envBackup)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  beforeEach(() => {
    delete process.env.ADMIN_TOKEN;
    usage.listUsers.mockClear();
  });

  it('401 without credentials', async () => {
    await getUsers().expect(401);
    expect(usage.listUsers).not.toHaveBeenCalled();
  });

  it('401 with an invalid or foreign-signed JWT', async () => {
    await getUsers().set('Authorization', 'Bearer not-a-jwt').expect(401);
    const forged = new JwtService({ secret: 'other' }).sign({
      sub: USERS.admin.id,
    });
    await getUsers().set('Authorization', `Bearer ${forged}`).expect(401);
  });

  it('401 when the JWT user no longer exists', async () => {
    await getUsers()
      .set('Authorization', `Bearer ${tokenFor('ghost')}`)
      .expect(401);
  });

  it('403 for a student JWT', async () => {
    await getUsers()
      .set('Authorization', `Bearer ${tokenFor(USERS.student.id)}`)
      .expect(403);
    expect(usage.listUsers).not.toHaveBeenCalled();
  });

  it('403 for a banned admin', async () => {
    await getUsers()
      .set('Authorization', `Bearer ${tokenFor(USERS.bannedAdmin.id)}`)
      .expect(403);
  });

  it('200 for an admin JWT', async () => {
    const res = await getUsers()
      .set('Authorization', `Bearer ${tokenFor(USERS.admin.id)}`)
      .expect(200);
    expect(res.body).toEqual([{ id: 'u-student' }]);
  });

  it('rejects the old default dev-admin-token when ADMIN_TOKEN is unset', async () => {
    await getUsers().set('x-admin-token', 'dev-admin-token').expect(401);
  });

  it('rejects dev-admin-token even if ADMIN_TOKEN is set to that placeholder', async () => {
    process.env.ADMIN_TOKEN = 'dev-admin-token';
    await getUsers().set('x-admin-token', 'dev-admin-token').expect(401);
  });

  it('ignores a too-short ADMIN_TOKEN', async () => {
    process.env.ADMIN_TOKEN = 'short-secret';
    expect(configuredStaticAdminToken()).toBeNull();
    await getUsers().set('x-admin-token', 'short-secret').expect(401);
  });

  it('accepts a configured strong ADMIN_TOKEN for tooling, and only that value', async () => {
    process.env.ADMIN_TOKEN = STRONG_TOKEN;
    await getUsers().set('x-admin-token', STRONG_TOKEN).expect(200);
    await getUsers().set('x-admin-token', `${STRONG_TOKEN}x`).expect(401);
  });

  it('a student JWT plus a wrong static token is still 403', async () => {
    process.env.ADMIN_TOKEN = STRONG_TOKEN;
    await getUsers()
      .set('x-admin-token', 'dev-admin-token')
      .set('Authorization', `Bearer ${tokenFor(USERS.student.id)}`)
      .expect(403);
  });
});
