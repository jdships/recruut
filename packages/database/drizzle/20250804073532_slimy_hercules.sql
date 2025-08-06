CREATE TABLE "applicationNote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicationId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"text" varchar(8000),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicationNote" ADD CONSTRAINT "applicationNote_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "applicationNote" ADD CONSTRAINT "applicationNote_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IX_applicationNote_applicationId" ON "applicationNote" USING btree ("applicationId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_applicationNote_userId" ON "applicationNote" USING btree ("userId" uuid_ops);