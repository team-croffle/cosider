ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(254) NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");