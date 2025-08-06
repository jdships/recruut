CREATE TYPE "public"."applicationflag" AS ENUM('normal', 'spam', 'scam', 'highLevel', 'great');--> statement-breakpoint
CREATE TYPE "public"."applicationstatus" AS ENUM('submitted', 'reviewed', 'shortlisted', 'rejected');--> statement-breakpoint
CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" uuid NOT NULL,
	"opportunityId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(32),
	"education" varchar(255),
	"experience" varchar(2000),
	"portfolioUrl" varchar(1024),
	"travelWillingness" varchar(255),
	"resumeUrl" varchar(2048),
	"aiScore" double precision,
	"aiFlag" "applicationflag" DEFAULT 'normal' NOT NULL,
	"manualFlag" "applicationflag",
	"flagHistory" jsonb,
	"submissionData" jsonb,
	"status" "applicationstatus" DEFAULT 'submitted' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_opportunityId_opportunity_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."opportunity"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IX_application_organizationId" ON "application" USING btree ("organizationId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_application_opportunityId" ON "application" USING btree ("opportunityId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_application_email" ON "application" USING btree ("email" text_ops);