CREATE TABLE "applicationComment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicationId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"text" varchar(2000),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicationComment" ADD CONSTRAINT "applicationComment_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "applicationComment" ADD CONSTRAINT "applicationComment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IX_applicationComment_applicationId" ON "applicationComment" USING btree ("applicationId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_applicationComment_userId" ON "applicationComment" USING btree ("userId" uuid_ops);