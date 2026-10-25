import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com')
    .trim()
    .toLowerCase();
  const username = (process.env.ADMIN_USERNAME ?? 'admin').trim();
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMeAdmin1!';
  const timezone = process.env.ADMIN_TIMEZONE ?? 'America/Mexico_City';

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      username,
      passwordHash,
      role: Role.ADMIN,
      timezone,
    },
    create: {
      email,
      username,
      passwordHash,
      role: Role.ADMIN,
      timezone,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Admin seed OK: ${admin.email} / ${admin.username} (${admin.role})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
