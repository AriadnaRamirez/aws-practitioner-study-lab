import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { GuestModule } from './guest/guest.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudyModule } from './study/study.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    ContentModule,
<<<<<<< HEAD
    StudyModule,
=======
    GuestModule,
    AdminModule,
>>>>>>> origin/cursor/aps-13-guest-analytics-54b6
  ],
})
export class AppModule {}
