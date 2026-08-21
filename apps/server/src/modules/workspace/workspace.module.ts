import { Module } from '@nestjs/common';

import { UserModule } from '../user/users.module';

import { ParseWorkspaceSlugPipe } from './pipes/parse-workspace-slug.pipe';
import { WorkspaceInvitationsController } from './workspace-invitation.controller';
import { WorkspaceInvitationsService } from './workspace-invitation.service';
import { WorkspaceMembersController } from './workspace-member.controller';
import { WorkspaceMembersService } from './workspace-member.service';
import { WorkspacesController } from './workspace.controller';
import { WorkspacesService } from './workspace.service';

import { FilesModule } from '@/common/file/files.module';
import { MailModule } from '@/common/mail/mail.module';

@Module({
  imports: [UserModule, FilesModule, MailModule],
  controllers: [WorkspacesController, WorkspaceMembersController, WorkspaceInvitationsController],
  providers: [
    WorkspacesService,
    WorkspaceMembersService,
    WorkspaceInvitationsService,
    ParseWorkspaceSlugPipe,
  ],
  exports: [ParseWorkspaceSlugPipe],
})
export class WorkspacesModule {}
