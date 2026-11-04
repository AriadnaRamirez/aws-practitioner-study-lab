import { Module } from '@nestjs/common';
import { UserExamsController } from './user-exams.controller';
import { UserExamsService } from './user-exams.service';

@Module({
  controllers: [UserExamsController],
  providers: [UserExamsService],
  exports: [UserExamsService],
})
export class UserExamsModule {}
