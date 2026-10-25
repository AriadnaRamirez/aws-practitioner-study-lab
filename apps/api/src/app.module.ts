import { Module } from '@nestjs/common';
import { ContentModule } from './content/content.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule, ContentModule],
})
export class AppModule {}
