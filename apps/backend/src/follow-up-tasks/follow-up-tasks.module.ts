import { Module } from '@nestjs/common';
import { FollowUpTasksService } from './follow-up-tasks.service';
import { FollowUpTasksController } from './follow-up-tasks.controller';

@Module({
  controllers: [FollowUpTasksController],
  providers: [FollowUpTasksService],
  exports: [FollowUpTasksService],
})
export class FollowUpTasksModule {}
