import { Module } from '@nestjs/common';

import { WorkspaceMembersController } from './workspace-member.controller';
import { WorkspaceMembersService } from './workspace-member.service';
import { WorkspacesController } from './workspace.controller';
import { WorkspacesService } from './workspace.service';

@Module({
  controllers: [WorkspacesController, WorkspaceMembersController],
  providers: [WorkspacesService, WorkspaceMembersService],
})
export class WorkspacesModule {}
