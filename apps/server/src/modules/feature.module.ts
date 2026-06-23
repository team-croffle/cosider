import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './task/tasks.module';
import { UserModule } from './user/users.module';
import { WorkspacesModule } from './workspace/workspace.module';

@Module({
  imports: [AuthModule, TasksModule, UserModule, WorkspacesModule],
})
export class FeatureModule {}
