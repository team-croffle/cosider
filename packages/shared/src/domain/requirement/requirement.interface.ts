import { ITask } from '../task';

import { ERequirementBlockType, ERequirementStatus } from './requirement.enum';

export interface IRequirement {
  id: string;
  projectId: string;
  documentId: string;
  type: ERequirementBlockType;
  contentText: string;
  contentHash: string;
  status: ERequirementStatus;
}

export type IRequirementTaskLink = {
  requirementId: Pick<IRequirement, 'id'>;
  taskId: Pick<ITask, 'id'>;
};
