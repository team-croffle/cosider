ALTER TABLE "user_profiles" RENAME COLUMN "nickname_updated_at" TO "handle_updated_at";--> statement-breakpoint
ALTER TABLE "media_files" DROP COLUMN "ref_type";--> statement-breakpoint
ALTER TABLE "media_files" DROP COLUMN "ref_id";--> statement-breakpoint
DROP TYPE "public"."file_ref_type_enum";