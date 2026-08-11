ALTER TABLE "refresh_tokens" ALTER COLUMN "token_value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
DROP TYPE "public"."file_context_type_enum";