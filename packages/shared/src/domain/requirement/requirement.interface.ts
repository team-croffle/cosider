import { ITask } from '../task';

import { ERequirementBlockType, ERequirementStatus } from './requirement.enum';

export interface IRequirement {
  id: string;
  projectId: string;
  documentId: string;
  type: ERequirementBlockType;
  contentText: string | null;
  contentHash: string | null;
  status: ERequirementStatus;
}

export type IRequirementTaskLink = {
  requirementId: Pick<IRequirement, 'id'>;
  taskId: Pick<ITask, 'id'>;
};
