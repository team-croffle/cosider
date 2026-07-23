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

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
export interface IProject {
  id: string;
  workspaceId: IWorkspace['id'];
  ownerId: IUser['id'];
  name: string;
  description: string | null;
  isPublic: boolean;
  key: string;
  // ID를 통해 NestJS가 PresignedURL로 Redirect해서 제공
  logoImageId: string | null;
  techStacks: string[] | null;
  sdlcType: ESdlcType;
  gitRepoUrl: string | null;
  gitProvider: string | null;
  gitDefaultBranch: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface IProjectMember {
  id: string;
  projectId: IProject['id'] | null;
  userId: IUser['id'] | null;
  role: EProjectMemberRole;
  joinedAt: Date | null;
}

export interface IProjectTaskCounter {
  projectId: IProject['id'];
  lastTaskNumber: number;
}

export interface IProjectStage {
  id: string;
  projectId: IProject['id'] | null;
  name: string;
  orderIndex: number;
  isRequired: boolean;
  status: EStageStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IProjectStageHistory {
  id: string;
  stageId: IProjectStage['id'] | null;
  action: EStageEditAction;
  status: EStageStatus;
  actorId: IUser['id'] | null;
  actorNickname: IUserProfile['nickname'] | null;
  isBypassed: boolean;
  createdAt: Date;
}

export interface ISprint {
  id: string;
  projectId: IProject['id'] | null;
  name: string;
  description: string | null;
  assigneeId: IUser['id'] | null;
  assigneeNickname: IUserProfile['nickname'] | null;
  status: ESprintStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ITestCase {
  id: string;
  requirementId: IRequirement['id'] | null;
  projectId: IProject['id'] | null;
  title: string;
  description: string | null;
  priority: EPriority;
  createdAt: Date;
}

export interface ITestRun {
  id: string;
  testCaseId: ITestCase['id'] | null;
  status: ETestStatus;
  testerId: IUser['id'] | null;
  testerNickname: IUserProfile['nickname'] | null;
  resultDetail: string | null;
  testedAt: Date;
}

export interface IProjectDeployment {
  id: string;
  projectId: IProject['id'] | null;
  version: string;
  platform: EDeploymentPlatform;
  status: EDeployStatus;
  deployerId: IUser['id'] | null;
  deployerNickname: IUserProfile['nickname'] | null;
  deploymentUrl: string | null;
  releaseNoteId: string | null;
  createdAt: Date;
}

export interface IProjectChecklist {
  id: string;
  projectId: IProject['id'] | null;
  stageId: IProjectStage['id'] | null;
  taskName: string;
  isRequired: boolean;
  isCompleted: boolean;
  linkedDocumentId: IDocument['id'] | null;
  completedAt: Date | null;
}
