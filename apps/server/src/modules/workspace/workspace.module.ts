import { Module } from '@nestjs/common';

import { ParseWorkspaceSlugPipe } from './pipes/parse-workspace-slug.pipe';
import { WorkspaceMembersController } from './workspace-member.controller';
import { WorkspaceMembersService } from './workspace-member.service';
import { WorkspacesController } from './workspace.controller';
import { WorkspacesService } from './workspace.service';

@Module({
  controllers: [WorkspacesController, WorkspaceMembersController],
  providers: [WorkspacesService, WorkspaceMembersService, ParseWorkspaceSlugPipe],
})
export class WorkspacesModule {}
