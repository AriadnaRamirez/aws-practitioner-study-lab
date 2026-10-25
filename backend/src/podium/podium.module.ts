import { Module } from '@nestjs/common';
import { PodiumController } from './podium.controller';
import { PodiumService } from './podium.service';

@Module({
  controllers: [PodiumController],
  providers: [PodiumService],
  exports: [PodiumService],
})
export class PodiumModule {}
