CREATE TYPE "public"."file_context_type_enum" AS ENUM('PROJECT_LOGO', 'WORKSPACE_LOGO', 'USER_AVATAR', 'TASK_ATTACHMENT');--> statement-breakpoint
ALTER TABLE "media_files" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_credentials" ALTER COLUMN "credential" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "media_files" ADD COLUMN "context_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "media_files" ADD COLUMN "workspace_id" uuid;--> statement-breakpoint
ALTER TABLE "media_files" ADD COLUMN "project_id" uuid;