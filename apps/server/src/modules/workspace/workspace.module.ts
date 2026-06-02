import { Module } from '@nestjs/common';

import { WorkspacesController } from './workspace.controller';
import { WorkspacesService } from './workspace.service';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
