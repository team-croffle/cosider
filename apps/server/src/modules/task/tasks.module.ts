import { Module } from '@nestjs/common';

import { WorkspacesModule } from '../workspace/workspace.module';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

import { RedisModule } from '@/common/redis/redis.module';

@Module({
  imports: [WorkspacesModule, RedisModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
