import { EPriority } from '../../common';

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
  workspaceId: string;
  ownerId: string;
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
  projectId: string;
  userId: string;
  role: EProjectMemberRole;
  joinedAt: string;
}

export interface IProjectTaskCounter {
  projectId: string;
  lastTaskNumber: number;
}

export interface IProjectStage {
  id: string;
  projectId: string;
  name: string;
  orderIndex: number;
  isRequired: boolean;
  status: EStageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectStageHistory {
  id: string;
  stageId: string;
  action: EStageEditAction;
  status: EStageStatus;
  actorId: string | null;
  actorNickname: string;
  isBypassed: boolean;
  createdAt: string;
}

export interface ISprint {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  asigneeid: string | null;
  asigneeNickname: string | null;
  status: ESprintStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITestCase {
  id: string;
  requirementId: string | null;
  title: string;
  description: string | null;
  priority: EPriority;
  createdAt: string;
}

export interface ITestRun {
  id: string;
  testCaseId: string;
  status: ETestStatus;
  testerId: string | null;
  testerNickname: string;
  resultDetail: string;
  testedAt: string;
}

export interface IProjectDeployment {
  id: string;
  projectId: string;
  version: string;
  platform: EDeploymentPlatform;
  status: EDeployStatus;
  deployerId: string | null;
  deployerNickname: string | null;
  releaseNodeId: string | null;
  createdAt: string;
}

export interface IProjectChecklist {
  id: string;
  projectId: string;
  stageId: string;
  taskName: string;
  isRequired: boolean;
  isCompleted: boolean;
  linkedDocumentId: string | null;
  completedAt: string | null;
}
