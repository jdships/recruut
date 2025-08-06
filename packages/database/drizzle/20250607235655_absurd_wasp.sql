CREATE TABLE "orderItem" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"quantity" integer NOT NULL,
	"productId" text NOT NULL,
	"variantId" text NOT NULL,
	"priceAmount" double precision,
	"type" text,
	"model" text
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" uuid NOT NULL,
	"status" varchar(64) NOT NULL,
	"provider" varchar(32) NOT NULL,
	"totalAmount" double precision NOT NULL,
	"currency" varchar(3) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptionItem" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriptionId" text NOT NULL,
	"quantity" integer NOT NULL,
	"productId" text NOT NULL,
	"variantId" text NOT NULL,
	"priceAmount" double precision,
	"interval" text NOT NULL,
	"intervalCount" integer NOT NULL,
	"type" text,
	"model" text
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" uuid NOT NULL,
	"status" varchar(64) NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"provider" varchar(32) NOT NULL,
	"cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
	"currency" varchar(3) NOT NULL,
	"periodStartsAt" timestamp (6) with time zone NOT NULL,
	"periodEndsAt" timestamp (6) with time zone NOT NULL,
	"trialStartsAt" timestamp (6) with time zone,
	"trialEndsAt" timestamp (6) with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" RENAME COLUMN "stripeCustomerId" TO "billingCustomerId";--> statement-breakpoint
DROP INDEX "IX_organization_stripeCustomerId";--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingEmail" varchar(255);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingLine1" varchar(255);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingLine2" varchar(255);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingCountry" varchar(3);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingPostalCode" varchar(16);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingCity" varchar(255);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "billingState" varchar(255);--> statement-breakpoint
CREATE INDEX "IX_orderItem_orderId" ON "orderItem" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "IX_order_organizationId" ON "order" USING btree ("organizationId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_subscriptionItem_subscriptionId" ON "subscriptionItem" USING btree ("subscriptionId");--> statement-breakpoint
CREATE INDEX "IX_subscription_organizationId" ON "subscription" USING btree ("organizationId" uuid_ops);--> statement-breakpoint
CREATE INDEX "IX_organization_billingCustomerId" ON "organization" USING btree ("billingCustomerId" text_ops);--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "tier";