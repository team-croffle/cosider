import { Task } from '../task';

import { ERequirementBlockType, ERequirementStatus } from './requirement.enum';

export interface Requirement {
  id: string;
  projectId: string;
  documentId: string;
  type: ERequirementBlockType;
  contentText: string;
  contentHash: string;
  status: ERequirementStatus;
}

export type RequirementTaskLink = {
  requirementId: Pick<Requirement, 'id'>;
  taskId: Pick<Task, 'id'>;
};
