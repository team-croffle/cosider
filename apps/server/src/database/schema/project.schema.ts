import {
  EDeploymentPlatform,
  EDeployStatus,
  EProjectMemberRole,
  ESdlcType,
  ESprintStatus,
  EStageEditAction,
  EStageStatus,
  ETestStatus,
  IProject,
  IProjectChecklist,
  IProjectDeployment,
  IProjectMember,
  IProjectStage,
  IProjectStageHistory,
  IProjectTaskCounter,
  ISprint,
  ITestCase,
  ITestRun,
} from '@cosider/shared';
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { mediaFiles, priorityEnum } from './common.schema';
import { users } from './user.schema';
import { workspaces } from './workspace.schema';

// ############### PROJECTS ###############
type ProjectSchema = Record<keyof IProject, unknown>;

export const sdlcTypeEnum = pgEnum(
  'sdlc_type_enum',
  Object.values(ESdlcType) as [ESdlcType, ...ESdlcType[]],
);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    workspaceId: uuid('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .notNull(),
    ownerId: uuid('owner_id')
      .references(() => users.id, { onDelete: 'restrict' })
      .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    isPublic: boolean('is_public').default(false).notNull(),
    key: varchar('key', { length: 20 }).notNull(),
    // S3에서 Key로 접근해서 NestJS가 PresignedURL로 변환해서 제공
    logoImageId: uuid('logo_image_id').references(() => mediaFiles.id, { onDelete: 'set null' }),
    techStacks: jsonb('tech_stacks').$type<string[]>(),
    sdlcType: sdlcTypeEnum('sdlc_type').notNull(),
    gitRepoUrl: varchar('git_repo_url', { length: 255 }),
    gitProvider: varchar('git_provider', { length: 20 }),
    gitDefaultBranch: varchar('git_default_branch', { length: 100 }).default('main'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  } satisfies ProjectSchema,
  (t) => [uniqueIndex('workspace_project_key_uidx').on(t.workspaceId, t.key)],
);

// ############### PROJECT MEMBERS ###############
type ProjectMemberSchema = Record<keyof IProjectMember, unknown>;

export const projectMemberRoleEnum = pgEnum(
  'project_member_role',
  Object.values(EProjectMemberRole) as [EProjectMemberRole, ...EProjectMemberRole[]],
);

export const projectMembers = pgTable(
  'project_members',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    role: projectMemberRoleEnum('role').notNull().default(EProjectMemberRole.VIEWER),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
  } satisfies ProjectMemberSchema,
  (t) => [uniqueIndex('user_project_uidx').on(t.userId, t.projectId)],
);

// ############### PROJECT TASK COUNTERS ###############
type ProjectTaskCounterSchema = Record<keyof IProjectTaskCounter, unknown>;

export const projectTaskCounters = pgTable('project_task_counters', {
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull()
    .primaryKey(),
  lastTaskNumber: integer('last_task_number').notNull().default(0),
} satisfies ProjectTaskCounterSchema);

// ############### PROJECT Stages ###############
type ProjectStageSchema = Record<keyof IProjectStage, unknown>;

export const stageStatusEnum = pgEnum(
  'stage_status',
  Object.values(EStageStatus) as [EStageStatus, ...EStageStatus[]],
);

export const projectStages = pgTable('project_stages', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  orderIndex: integer('order_uniqueIndex').notNull().default(0),
  isRequired: boolean('is_required').notNull().default(true),
  status: stageStatusEnum('status').notNull().default(EStageStatus.PLANNED),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
} satisfies ProjectStageSchema);

// ############### PROJECT Stages Histories ###############
type ProjectStageHistorySchema = Record<keyof IProjectStageHistory, unknown>;

export const stageEditActionEnum = pgEnum(
  'stage_action',
  Object.values(EStageEditAction) as [EStageEditAction, ...EStageEditAction[]],
);

export const projectStageHistories = pgTable('stage_histories', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  status: stageStatusEnum('status').notNull(),
  stageId: uuid('stage_id').references(() => projectStages.id, { onDelete: 'cascade' }),
  action: stageEditActionEnum('action').notNull(),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  actorNickname: varchar('actor_nickname', { length: 100 }),
  isBypassed: boolean('is_bypassed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
} satisfies ProjectStageHistorySchema);

// ############### PROJECT SPRINTS ###############
type SprintSchema = Record<keyof ISprint, unknown>;

export const sprintStatusEnum = pgEnum(
  'sprint_status',
  Object.values(ESprintStatus) as [ESprintStatus, ...ESprintStatus[]],
);

export const sprints = pgTable('sprints', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  assigneeId: uuid('asignee_id').references(() => users.id, { onDelete: 'set null' }),
  assigneeNickname: varchar('asignee_nickname', { length: 100 }),
  status: sprintStatusEnum('status').notNull().default(ESprintStatus.UPCOMING),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
} satisfies SprintSchema);

// ############### PROJECT TEST CASES ###############
// TODO: Requirement schema가 생성되고 나면 'requirementId'를 FK로 추가하기
type TestCaseSchema = Record<keyof Omit<ITestCase, 'requirementId'>, unknown>;

export const testCases = pgTable('test_cases', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  // requirementId: uuid('requirement_id').references(() => requirement.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  priority: priorityEnum('priority').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
} satisfies TestCaseSchema);

// ############### PROJECT TEST RUNS ###############
type TestRunSchema = Record<keyof ITestRun, unknown>;

export const testStatusEnum = pgEnum(
  'test_status',
  Object.values(ETestStatus) as [ETestStatus, ...ETestStatus[]],
);

export const testRuns = pgTable('test_runs', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  testCaseId: uuid('test_case_id').references(() => testCases.id, { onDelete: 'cascade' }),
  status: testStatusEnum('status').notNull(),
  testerId: uuid('tester_id').references(() => users.id, { onDelete: 'set null' }),
  testerNickname: varchar('tester_nickname', { length: 100 }),
  resultDetail: text('result_detail'),
  testedAt: timestamp('tested_at', { withTimezone: true }).notNull().defaultNow(),
} satisfies TestRunSchema);

// ############### PROJECT DEPLOYMENTS ###############
type DeploymentSchema = Record<keyof IProjectDeployment, unknown>;

export const deploymentPlatformEnum = pgEnum(
  'deployment_platform',
  Object.values(EDeploymentPlatform) as [EDeploymentPlatform, ...EDeploymentPlatform[]],
);

export const deploymentStatusEnum = pgEnum(
  'deployment_status',
  Object.values(EDeployStatus) as [EDeployStatus, ...EDeployStatus[]],
);

export const projectDeployments = pgTable('project_deployments', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  version: varchar('version', { length: 100 }).notNull(),
  platform: deploymentPlatformEnum('platform').notNull(),
  status: deploymentStatusEnum('status').notNull(),
  deployerId: uuid('deployer_id').references(() => users.id, { onDelete: 'set null' }),
  deployerNickname: varchar('deployer_nickname', { length: 100 }),
  deploymentUrl: text('deployment_url'),
  releaseNoteId: uuid('release_node_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
} satisfies DeploymentSchema);

// ############### PROJECT CHECKLISTS ###############
type ProjectChecklistSchema = Record<keyof IProjectChecklist, unknown>;

export const projectChecklists = pgTable('project_checklists', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  stageId: uuid('stage_id').references(() => projectStages.id, { onDelete: 'cascade' }),
  taskName: varchar('task_name', { length: 100 }).notNull(),
  isRequired: boolean('is_required').notNull().default(true),
  isCompleted: boolean('is_completed').notNull().default(false),
  linkedDocumentId: uuid('linked_document_id'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
} satisfies ProjectChecklistSchema);
