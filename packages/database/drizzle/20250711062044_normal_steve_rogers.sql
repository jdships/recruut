CREATE TABLE "opportunity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizationId" uuid NOT NULL,
	"createdBy" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(2000),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_organizationId_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IX_opportunity_organizationId" ON "opportunity" USING btree ("organizationId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_opportunity_createdBy" ON "opportunity" USING btree ("createdBy" uuid_ops);