import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspacesService {
  createWorkspace() {
    return {
      id: 'workspace-id',
      name: 'New Workspace',
      createdAt: new Date(),
    };
  }
}
