import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ContentModule } from './content/content.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { GuestModule } from './guest/guest.module';
import { HealthModule } from './health/health.module';
import { PodiumModule } from './podium/podium.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudyModule } from './study/study.module';
import { UserExamsModule } from './user-exams/user-exams.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    HealthModule,
    AuthModule,
    ContentModule,
    StudyModule,
    GuestModule,
    AdminModule,
    PodiumModule,
    FeatureFlagsModule,
    UserExamsModule,
  ],
})
export class AppModule {}
