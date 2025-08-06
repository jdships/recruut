ALTER TABLE "opportunity" ADD COLUMN "positionLink" varchar(2000);--> statement-breakpoint
ALTER TABLE "opportunity" ADD COLUMN "documents" jsonb;--> statement-breakpoint
ALTER TABLE "opportunity" ADD COLUMN "hiringManagerEmail" varchar(255);--> statement-breakpoint
ALTER TABLE "opportunity" ADD COLUMN "moreContext" varchar(2000);