import { IDocument } from '../document';
import { IProject } from '../project';
import { ITask } from '../task';

import { ERequirementBlockType, ERequirementStatus } from './requirement.enum';

export interface IRequirement {
  id: string;
  projectId: IProject['id'];
  documentId: IDocument['id'];
  type: ERequirementBlockType;
  requirementCode: string;
  contentText: string | null;
  contentHash: string | null;
  status: ERequirementStatus;
}

export type IRequirementTaskLink = {
  requirementId: IRequirement['id'];
  taskId: ITask['id'];
};
