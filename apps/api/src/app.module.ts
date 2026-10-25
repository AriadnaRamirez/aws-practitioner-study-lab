import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudyModule } from './study/study.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    ContentModule,
    StudyModule,
  ],
})
export class AppModule {}
