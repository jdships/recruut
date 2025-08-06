CREATE TABLE "opportunityQuestion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunityId" uuid NOT NULL,
	"createdBy" uuid NOT NULL,
	"question" varchar(1000) NOT NULL,
	"order" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opportunityQuestion" ADD CONSTRAINT "opportunityQuestion_opportunityId_opportunity_id_fk" FOREIGN KEY ("opportunityId") REFERENCES "public"."opportunity"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "opportunityQuestion" ADD CONSTRAINT "opportunityQuestion_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IX_opportunityQuestion_opportunityId" ON "opportunityQuestion" USING btree ("opportunityId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_opportunityQuestion_createdBy" ON "opportunityQuestion" USING btree ("createdBy" uuid_ops);