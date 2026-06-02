export enum ESdlcType {
  WATERFALL = 'WATERFALL',
  PROTOTYPING = 'PROTOTYPING',
  SPIRAL = 'SPIRAL',
  SCRUM = 'SCRUM',
  KANBAN = 'KANBAN',
  HYBRID = 'HYBRID',
}

export enum EProjectMemberRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum ESprintStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  DELAYED = 'DELAYED',
  CLOSED = 'CLOSED',
}

export enum EStageStatus {
  PLANNED = 'PLANNED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  CANCELED = 'CANCELED',
}

export enum EStageEditAction {
  COMPLETE = 'COMPLETE',
  SKIP = 'SKIP',
  CANCEL = 'CANCEL',
  REVERT = 'REVERT',
}

export enum ETestType {
  UNIT = 'UNIT',
  INTEGRATION = 'INTEGRATION',
  E2E = 'E2E',
}

export enum ETestStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export enum EDeploymentPlatform {
  AWS = 'AWS',
  SUPABASE = 'SUPABASE',
  VERCEL = 'VERCEL',
  DOCKER = 'DOCKER',
  ON_PREMISE = 'ON_PREMISE',
}

export enum EDeployStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  IN_PROGRESS = 'IN_PROGRESS',
}
