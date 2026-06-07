import { EPriority } from '../../common';
import { IDocument } from '../document';
import { IRequirement } from '../requirement';
import { IUser, IUserProfile } from '../user';
import { IWorkspace } from '../workspace';

import {
  EDeploymentPlatform,
  EDeployStatus,
  EProjectMemberRole,
  ESdlcType,
  ESprintStatus,
  EStageEditAction,
  EStageStatus,
  ETestStatus,
} from './project.enum';

export interface IProject {
  id: string;
  workspaceId: IWorkspace['id'];
  ownerId: IUser['id'];
  name: string;
  description: string | null;
  isPublic: boolean;
  key: string;
  logoUrl: string | null;
  techStacks: string[];
  sdlcType: ESdlcType;
  gitRepoUrl: string | null;
  gitProvider: string | null;
  gitDefaultBranch: string | null;
  createdAt: string;
  deletedAt: string;
}

export interface IProjectMember {
  id: string;
  projectId: IProject['id'];
  userId: IUser['id'];
  role: EProjectMemberRole;
  joinedAt: string;
}

export interface IProjectTaskCounter {
  projectId: IProject['id'];
  lastTaskNumber: number;
}

export interface IProjectStage {
  id: string;
  projectId: IProject['id'];
  name: string;
  orderIndex: number;
  isRequired: boolean;
  status: EStageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectStageHistory {
  id: string;
  stageId: IProjectStage['id'];
  action: EStageEditAction;
  status: EStageStatus;
  actorId: IUser['id'] | null;
  actorNickname: IUserProfile['nickname'];
  isBypassed: boolean;
  createdAt: string;
}

export interface ISprint {
  id: string;
  projectId: IProject['id'];
  name: string;
  description: string | null;
  assigneeId: IUser['id'] | null;
  assigneeNickname: IUserProfile['nickname'] | null;
  status: ESprintStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITestCase {
  id: string;
  requirementId: IRequirement['id'] | null;
  projectId: IProject['id'];
  title: string;
  description: string | null;
  priority: EPriority;
  createdAt: string;
}

export interface ITestRun {
  id: string;
  testCaseId: ITestCase['id'];
  status: ETestStatus;
  testerId: IUser['id'] | null;
  testerNickname: IUserProfile['nickname'];
  resultDetail: string;
  testedAt: string;
}

export interface IProjectDeployment {
  id: string;
  projectId: IProject['id'];
  version: string;
  platform: EDeploymentPlatform;
  status: EDeployStatus;
  deployerId: IUser['id'] | null;
  deployerNickname: IUserProfile['nickname'] | null;
  deploymentUrl: string | null;
  releaseNoteId: string | null;
  createdAt: string;
}

export interface IProjectChecklist {
  id: string;
  projectId: IProject['id'];
  stageId: IProjectStage['id'];
  taskName: string;
  isRequired: boolean;
  isCompleted: boolean;
  linkedDocumentId: IDocument['id'] | null;
  completedAt: string | null;
}
