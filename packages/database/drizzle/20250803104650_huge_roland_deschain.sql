CREATE TYPE "public"."plan" AS ENUM('free', 'pro', 'unlimited');--> statement-breakpoint
DROP TABLE "apiKey" CASCADE;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "plan" "plan" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "planExpiresAt" timestamp (6) with time zone;