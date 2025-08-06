import { relations } from "drizzle-orm";
import {
	boolean,
	customType,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Custom Types
export const bytea = customType<{
	data: Buffer | null;
	notNull: false;
	default: false;
}>({
	dataType() {
		return "bytea";
	},
	toDriver(val: Buffer | null) {
		return val;
	},
	fromDriver(value: unknown) {
		if (value === null) {
			return null;
		}

		if (value instanceof Buffer) {
			return value;
		}

		if (typeof value === "string") {
			return Buffer.from(value, "hex");
		}

		throw new Error(`Unexpected type received from driver: ${typeof value}`);
	},
});

// Enums

// Simple plan enum for Polar.sh integration
export const planEnum = pgEnum("plan", ["free", "pro", "unlimited"]);

export enum ActionType {
	CREATE = "create",
	UPDATE = "update",
	DELETE = "delete",
}

export enum ActorType {
	SYSTEM = "system",
	MEMBER = "member",
	API = "api",
}

export enum ContactRecord {
	PERSON = "person",
	COMPANY = "company",
}

export enum ContactStage {
	LEAD = "lead",
	QUALIFIED = "qualified",
	OPPORTUNITY = "opportunity",
	PROPOSAL = "proposal",
	IN_NEGOTIATION = "inNegotiation",
	LOST = "lost",
	WON = "won",
}

export enum ContactTaskStatus {
	OPEN = "open",
	COMPLETED = "completed",
}

export enum DayOfWeek {
	SUNDAY = "sunday",
	MONDAY = "monday",
	TUESDAY = "tuesday",
	WEDNESDAY = "wednesday",
	THURSDAY = "thursday",
	FRIDAY = "friday",
	SATURDAY = "saturday",
}

export enum FeedbackCategory {
	SUGGESTION = "suggestion",
	PROBLEM = "problem",
	QUESTION = "question",
}

export enum InvitationStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REVOKED = "revoked",
}

export enum Role {
	MEMBER = "member",
	ADMIN = "admin",
}

export enum WebhookTrigger {
	CONTACT_CREATED = "contactCreated",
	CONTACT_UPDATED = "contactUpdated",
	CONTACT_DELETED = "contactDeleted",
}

export enum ApplicationStatus {
	SUBMITTED = "submitted",
	REVIEWED = "reviewed",
	SHORTLISTED = "shortlisted",
	REJECTED = "rejected",
}

export enum ApplicationFlag {
	NORMAL = "normal",
	SPAM = "spam",
	SCAM = "scam",
	HIGH_LEVEL = "highLevel",
	GREAT = "great",
}

function enumToPgEnum<T extends Record<string, string>>(myEnum: T) {
	return Object.values(myEnum).map((value) => `${value}`) as [
		T[keyof T],
		...T[keyof T][],
	];
}

// use lowercase: https://github.com/drizzle-team/drizzle-orm/issues/1564#issuecomment-2320605690

export const actionTypeEnum = pgEnum("actiontype", enumToPgEnum(ActionType));
export const actorTypeEnum = pgEnum("actortype", enumToPgEnum(ActorType));
export const contactRecordEnum = pgEnum(
	"contactrecord",
	enumToPgEnum(ContactRecord),
);
export const contactStageEnum = pgEnum(
	"contactstage",
	enumToPgEnum(ContactStage),
);
export const contactTaskStatusEnum = pgEnum(
	"contacttaskstatus",
	enumToPgEnum(ContactTaskStatus),
);
export const dayOfWeekEnum = pgEnum("dayofweek", enumToPgEnum(DayOfWeek));
export const feedbackCategoryEnum = pgEnum(
	"feedbackcategory",
	enumToPgEnum(FeedbackCategory),
);
export const invitationStatusEnum = pgEnum(
	"invitationstatus",
	enumToPgEnum(InvitationStatus),
);
export const roleEnum = pgEnum("Role", enumToPgEnum(Role));
export const webhookTriggerEnum = pgEnum(
	"webhooktrigger",
	enumToPgEnum(WebhookTrigger),
);

export const applicationStatusEnum = pgEnum(
	"applicationstatus",
	enumToPgEnum(ApplicationStatus),
);
export const applicationFlagEnum = pgEnum(
	"applicationflag",
	enumToPgEnum(ApplicationFlag),
);

// Tables

export const authenticatorAppTable = pgTable(
	"authenticatorApp",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		accountName: varchar("accountName", { length: 255 }).notNull(),
		issuer: varchar("issuer", { length: 255 }).notNull(),
		secret: varchar("secret", { length: 255 }).notNull(),
		recoveryCodes: varchar("recoveryCodes", { length: 1024 }).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("IX_authenticatorApp_userId_unique").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const changeEmailRequestTable = pgTable(
	"changeEmailRequest",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		email: text("email").notNull(),
		expires: timestamp("expires", { precision: 3, mode: "date" }).notNull(),
		valid: boolean("valid").default(false).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_changeEmailRequest_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactTable = pgTable(
	"contact",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }),
		address: varchar("address", { length: 255 }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
		image: varchar("image", { length: 2048 }),
		stage: contactStageEnum("stage").default(ContactStage.LEAD).notNull(),
		phone: varchar("phone", { length: 32 }),
		record: contactRecordEnum("record").default(ContactRecord.PERSON).notNull(),
	},
	(table) => [
		index("IX_contact_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const opportunityTable = pgTable(
	"opportunity",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		createdBy: uuid("createdBy")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		title: varchar("title", { length: 255 }).notNull(),
		description: varchar("description", { length: 2000 }),
		positionLink: varchar("positionLink", { length: 2000 }),
		documents: jsonb("documents"),
		hiringManagerEmail: varchar("hiringManagerEmail", { length: 255 }),
		moreContext: varchar("moreContext", { length: 2000 }),
		status: varchar("status", { length: 50 }).default("active").notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_opportunity_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_opportunity_createdBy").using(
			"btree",
			table.createdBy.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactCommentTable = pgTable(
	"contactComment",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		text: varchar("text", { length: 2000 }).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_contactComment_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_contactComment_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactNoteTable = pgTable(
	"contactNote",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		text: varchar("text", { length: 8000 }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_contactNote_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_contactNote_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const applicationCommentTable = pgTable(
	"applicationComment",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		applicationId: uuid("applicationId")
			.notNull()
			.references(() => applicationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		text: varchar("text", { length: 2000 }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_applicationComment_applicationId").using(
			"btree",
			table.applicationId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_applicationComment_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactPageVisitTable = pgTable(
	"contactPageVisit",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		timestamp: timestamp("timestamp", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		userId: uuid("userId").references(() => userTable.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
	},
	(table) => [
		index("IX_contactPageVisit_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_contactPageVisit_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactImageTable = pgTable(
	"contactImage",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		data: bytea("data"),
		contentType: varchar("contentType", { length: 255 }),
		hash: varchar("hash", { length: 64 }),
	},
	(table) => [
		index("IX_contactImage_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactTaskTable = pgTable(
	"contactTask",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		title: varchar("title", { length: 255 }).notNull(),
		description: varchar("description", { length: 8000 }),
		status: contactTaskStatusEnum("status")
			.default(ContactTaskStatus.OPEN)
			.notNull(),
		dueDate: timestamp("dueDate", { precision: 3, mode: "date" }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_contactTask_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const favoriteTable = pgTable(
	"favorite",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		order: integer("order").default(0).notNull(),
	},
	(table) => [
		index("IX_favorite_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_favorite_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const invitationTable = pgTable(
	"invitation",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		token: uuid("token").notNull().defaultRandom(),
		email: varchar("email", { length: 255 }).notNull(),
		role: roleEnum("role").default(Role.MEMBER).notNull(),
		status: invitationStatusEnum("status")
			.default(InvitationStatus.PENDING)
			.notNull(),
		lastSentAt: timestamp("lastSentAt", { precision: 3, mode: "date" }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_invitation_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_invitation_token").using(
			"btree",
			table.token.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactTagTable = pgTable(
	"contactTag",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		text: varchar("text", { length: 128 }).notNull(),
	},
	(table) => [
		uniqueIndex("IX_contactTag_text_unique").using(
			"btree",
			table.text.asc().nullsLast().op("text_ops"),
		),
	],
);

export const accountTable = pgTable(
	"account",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("IX_account_provider_providerAccountId_unique").using(
			"btree",
			table.provider.asc().nullsLast().op("text_ops"),
			table.providerAccountId.asc().nullsLast().op("text_ops"),
		),
		index("IX_account_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const feedbackTable = pgTable(
	"feedback",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		userId: uuid("userId").references(() => userTable.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
		category: feedbackCategoryEnum("category")
			.default(FeedbackCategory.SUGGESTION)
			.notNull(),
		message: varchar("message", { length: 4000 }).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_feedback_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_feedback_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const notificationTable = pgTable(
	"notification",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		subject: varchar("subject", { length: 128 }),
		content: varchar("content", { length: 8000 }).notNull(),
		link: varchar("link", { length: 2000 }),
		seenAt: timestamp("seenAt", { precision: 3, mode: "date" }),
		dismissed: boolean("dismissed").default(false).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_notification_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const resetPasswordRequestTable = pgTable(
	"resetPasswordRequest",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		email: text("email").notNull(),
		expires: timestamp("expires", { precision: 3, mode: "date" }).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_resetPasswordRequest_email").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
	],
);

export const userImageTable = pgTable(
	"userImage",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		data: bytea("data"),
		contentType: varchar("contentType", { length: 255 }),
		hash: varchar("hash", { length: 64 }),
	},
	(table) => [
		index("IX_userImage_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const userTable = pgTable(
	"user",
	{
		id: uuid("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		email: text("email").unique(),
		emailVerified: timestamp("emailVerified", { precision: 3, mode: "date" }),
		password: varchar("password", { length: 60 }),
		lastLogin: timestamp("lastLogin", { precision: 3, mode: "date" }),
		locale: varchar("locale", { length: 8 }).default("en-US").notNull(),
		completedOnboarding: boolean("completedOnboarding")
			.default(false)
			.notNull(),
		enabledContactsNotifications: boolean("enabledContactsNotifications")
			.default(false)
			.notNull(),
		enabledInboxNotifications: boolean("enabledInboxNotifications")
			.default(false)
			.notNull(),
		enabledNewsletter: boolean("enabledNewsletter").default(false).notNull(),
		enabledProductUpdates: boolean("enabledProductUpdates")
			.default(false)
			.notNull(),
		enabledWeeklySummary: boolean("enabledWeeklySummary")
			.default(false)
			.notNull(),
		image: varchar("image", { length: 2048 }),
		name: varchar("name", { length: 64 }).notNull(),
		phone: varchar("phone", { length: 32 }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("IX_user_email_unique").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
		index("IX_user_name").using(
			"btree",
			table.name.asc().nullsLast().op("text_ops"),
		),
	],
);

export const sessionTable = pgTable(
	"session",
	{
		sessionToken: text("sessionToken").primaryKey(),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, { onDelete: "cascade" }),
		expires: timestamp("expires", { mode: "date" }).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_session_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const verificationTokenTable = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { precision: 3, mode: "date" }).notNull(),
	},
	(table) => [
		uniqueIndex("IX_verificationToken_identifier_unique").using(
			"btree",
			table.identifier.asc().nullsLast().op("text_ops"),
			table.token.asc().nullsLast().op("text_ops"),
		),
	],
);

export const workHoursTable = pgTable(
	"workHours",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		dayOfWeek: dayOfWeekEnum("dayOfWeek").default(DayOfWeek.SUNDAY).notNull(),
	},
	(table) => [
		index("IX_workHours_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const workTimeSlotTable = pgTable(
	"workTimeSlot",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		workHoursId: uuid("workHoursId")
			.notNull()
			.references(() => workHoursTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		start: timestamp("start", { precision: 2, withTimezone: false }).notNull(),
		end: timestamp("end", { precision: 2, withTimezone: false }).notNull(),
	},
	(table) => [
		index("IX_workTimeSlot_workHoursId").using(
			"btree",
			table.workHoursId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const contactActivityTable = pgTable(
	"contactActivity",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		actionType: actionTypeEnum("actionType").notNull(),
		actorId: varchar("actorId", { length: 255 }).notNull(),
		actorType: actorTypeEnum("actorType").notNull(),
		metadata: jsonb("metadata"),
		occurredAt: timestamp("occurredAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("IX_contactActivity_contactId").using(
			"btree",
			table.contactId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_contactActivity_occurredAt").using(
			"btree",
			table.occurredAt.asc().nullsLast().op("timestamp_ops"),
		),
	],
);

export const webhookTable = pgTable(
	"webhook",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		secret: varchar("secret", { length: 1024 }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		triggers: webhookTriggerEnum("triggers").array().notNull(),
		url: varchar("url", { length: 2000 }).notNull(),
	},
	(table) => [
		{
			organizationIdIndex: index("IX_webhook_organizationId").on(
				table.organizationId,
			),
		},
	],
);

export const membershipTable = pgTable(
	"membership",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		userId: uuid("userId")
			.notNull()
			.references(() => userTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		role: roleEnum("role").default(Role.MEMBER).notNull(),
		isOwner: boolean("isOwner").default(false).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex("IX_membership_organizationId_userId_unique").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_membership_userId").using(
			"btree",
			table.userId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_membership_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const organizationLogoTable = pgTable(
	"organizationLogo",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		data: bytea("data"),
		contentType: varchar("contentType", { length: 255 }),
		hash: varchar("hash", { length: 64 }),
	},
	(table) => [
		index("IX_organizationLogo_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const organizationTable = pgTable(
	"organization",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		address: varchar("address", { length: 255 }),
		email: varchar("email", { length: 255 }),
		website: varchar("website", { length: 2000 }),
		phone: varchar("phone", { length: 32 }),
		facebookPage: varchar("facebookPage", { length: 2000 }),
		instagramProfile: varchar("instagramProfile", { length: 2000 }),
		linkedInProfile: varchar("linkedInProfile", { length: 2000 }),
		tikTokProfile: varchar("tikTokProfile", { length: 2000 }),
		xProfile: varchar("xProfile", { length: 2000 }),
		youTubeChannel: varchar("youTubeChannel", { length: 2000 }),
		logo: varchar("logo", { length: 2048 }),
		slug: varchar("slug", { length: 255 }).notNull(),
		billingCustomerId: varchar("billingCustomerId", { length: 255 }),
		billingEmail: varchar("billingEmail", { length: 255 }),
		billingLine1: varchar("billingLine1", { length: 255 }),
		billingLine2: varchar("billingLine2", { length: 255 }),
		billingCountry: varchar("billingCountry", { length: 3 }),
		billingPostalCode: varchar("billingPostalCode", { length: 16 }),
		billingCity: varchar("billingCity", { length: 255 }),
		billingState: varchar("billingState", { length: 255 }),
		plan: planEnum("plan").notNull().default("free"),
		planExpiresAt: timestamp("planExpiresAt", {
			withTimezone: true,
			precision: 6,
		}),
	},
	(table) => [
		index("IX_organization_billingCustomerId").using(
			"btree",
			table.billingCustomerId.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("IX_organization_slug_unique").using(
			"btree",
			table.slug.asc().nullsLast().op("text_ops"),
		),
	],
);

export const subscriptionTable = pgTable(
	"subscription",
	{
		id: text("id").primaryKey(),
		organizationId: uuid("organizationId").notNull(),
		status: varchar("status", { length: 64 }).notNull(),
		active: boolean("active").notNull().default(false),
		provider: varchar("provider", { length: 32 }).notNull(),
		cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").notNull().default(false),
		currency: varchar("currency", { length: 3 }).notNull(),
		periodStartsAt: timestamp("periodStartsAt", {
			withTimezone: true,
			precision: 6,
		}).notNull(),
		periodEndsAt: timestamp("periodEndsAt", {
			withTimezone: true,
			precision: 6,
		}).notNull(),
		trialStartsAt: timestamp("trialStartsAt", {
			withTimezone: true,
			precision: 6,
		}),
		trialEndsAt: timestamp("trialEndsAt", { withTimezone: true, precision: 6 }),
		createdAt: timestamp("createdAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("IX_subscription_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const subscriptionItemTable = pgTable(
	"subscriptionItem",
	{
		id: text("id").primaryKey(),
		subscriptionId: text("subscriptionId").notNull(),
		quantity: integer("quantity").notNull(),
		productId: text("productId").notNull(),
		variantId: text("variantId").notNull(),
		priceAmount: doublePrecision("priceAmount"),
		interval: text("interval").notNull(),
		intervalCount: integer("intervalCount").notNull(),
		type: text("type"),
		model: text("model"),
	},
	(table) => [
		index("IX_subscriptionItem_subscriptionId").using(
			"btree",
			table.subscriptionId.asc().nullsLast(),
		),
	],
);

export const orderTable = pgTable(
	"order",
	{
		id: text("id").primaryKey(),
		organizationId: uuid("organizationId").notNull(),
		status: varchar("status", { length: 64 }).notNull(),
		provider: varchar("provider", { length: 32 }).notNull(),
		totalAmount: doublePrecision("totalAmount").notNull(),
		currency: varchar("currency", { length: 3 }).notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("IX_order_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
	],
);

export const orderItemTable = pgTable(
	"orderItem",
	{
		id: text("id").primaryKey(),
		orderId: text("orderId").notNull(),
		quantity: integer("quantity").notNull(),
		productId: text("productId").notNull(),
		variantId: text("variantId").notNull(),
		priceAmount: doublePrecision("priceAmount"),
		type: text("type"),
		model: text("model"),
	},
	(table) => [
		index("IX_orderItem_orderId").using(
			"btree",
			table.orderId.asc().nullsLast(),
		),
	],
);

export const contactToContactTagTable = pgTable(
	"contactToContactTag",
	{
		contactId: uuid("contactId")
			.notNull()
			.references(() => contactTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		contactTagId: uuid("contactTagId")
			.notNull()
			.references(() => contactTagTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
	},
	(table) => [
		{
			pk: primaryKey({
				columns: [table.contactId, table.contactTagId],
			}),
			contactIdIdx: index("IX_contactToContactTag_contactId").on(
				table.contactId,
			),
			contactTagIdIdx: index("IX_contactToContactTag_contactTagId").on(
				table.contactTagId,
			),
		},
	],
);

export const applicationTable = pgTable(
	"application",
	{
		id: uuid("id").primaryKey().notNull().defaultRandom(),
		organizationId: uuid("organizationId")
			.notNull()
			.references(() => organizationTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		opportunityId: uuid("opportunityId")
			.notNull()
			.references(() => opportunityTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		phone: varchar("phone", { length: 32 }),
		education: varchar("education", { length: 255 }),
		experience: varchar("experience", { length: 2000 }),
		portfolioUrl: varchar("portfolioUrl", { length: 1024 }),
		travelWillingness: varchar("travelWillingness", { length: 255 }),
		resumeUrl: varchar("resumeUrl", { length: 2048 }),
		image: varchar("image", { length: 2048 }),
		aiScore: doublePrecision("aiScore"),
		aiFlag: applicationFlagEnum("aiFlag")
			.default(ApplicationFlag.NORMAL)
			.notNull(),
		aiAssessment: text("aiAssessment"), // Comprehensive AI-generated assessment for recruiters
		manualFlag: applicationFlagEnum("manualFlag"),
		flagHistory: jsonb("flagHistory"), // Array of flag changes with timestamps
		submissionData: jsonb("submissionData"), // Raw answers for future-proofing
		status: applicationStatusEnum("status")
			.default(ApplicationStatus.SUBMITTED)
			.notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("IX_application_organizationId").using(
			"btree",
			table.organizationId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_application_opportunityId").using(
			"btree",
			table.opportunityId.asc().nullsLast().op("uuid_ops"),
		),
		index("IX_application_email").using(
			"btree",
			table.email.asc().nullsLast().op("text_ops"),
		),
	],
);

// Relations

export const organizationRelations = relations(
	organizationTable,
	({ many }) => ({
		contacts: many(contactTable),
		invitations: many(invitationTable),
		feedbacks: many(feedbackTable),
		workHours: many(workHoursTable),
		webhooks: many(webhookTable),
		memberships: many(membershipTable),
		opportunities: many(opportunityTable),
	}),
);

export const authenticatorAppRelations = relations(
	authenticatorAppTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [authenticatorAppTable.userId],
			references: [userTable.id],
		}),
	}),
);

export const userRelations = relations(userTable, ({ many }) => ({
	authenticatorApps: many(authenticatorAppTable),
	changeEmailRequests: many(changeEmailRequestTable),
	contactComments: many(contactCommentTable),
	contactNotes: many(contactNoteTable),
	contactPageVisits: many(contactPageVisitTable),
	favorites: many(favoriteTable),
	accounts: many(accountTable),
	feedbacks: many(feedbackTable),
	notifications: many(notificationTable),
	sessions: many(sessionTable),
	memberships: many(membershipTable),
	opportunities: many(opportunityTable),
}));

export const changeEmailRequestRelations = relations(
	changeEmailRequestTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [changeEmailRequestTable.userId],
			references: [userTable.id],
		}),
	}),
);

export const contactRelations = relations(contactTable, ({ one, many }) => ({
	organization: one(organizationTable, {
		fields: [contactTable.organizationId],
		references: [organizationTable.id],
	}),
	contactComments: many(contactCommentTable),
	contactNotes: many(contactNoteTable),
	contactPageVisits: many(contactPageVisitTable),
	contactTasks: many(contactTaskTable),
	favorites: many(favoriteTable),
	contactActivities: many(contactActivityTable),
	contactToContactTags: many(contactToContactTagTable),
}));

export const opportunityRelations = relations(
	opportunityTable,
	({ one, many }) => ({
		organization: one(organizationTable, {
			fields: [opportunityTable.organizationId],
			references: [organizationTable.id],
		}),
		creator: one(userTable, {
			fields: [opportunityTable.createdBy],
			references: [userTable.id],
		}),
	}),
);

export const contactCommentRelations = relations(
	contactCommentTable,
	({ one }) => ({
		contact: one(contactTable, {
			fields: [contactCommentTable.contactId],
			references: [contactTable.id],
		}),
		user: one(userTable, {
			fields: [contactCommentTable.userId],
			references: [userTable.id],
		}),
	}),
);

export const contactNoteRelations = relations(contactNoteTable, ({ one }) => ({
	contact: one(contactTable, {
		fields: [contactNoteTable.contactId],
		references: [contactTable.id],
	}),
	user: one(userTable, {
		fields: [contactNoteTable.userId],
		references: [userTable.id],
	}),
}));

export const contactPageVisitRelations = relations(
	contactPageVisitTable,
	({ one }) => ({
		contact: one(contactTable, {
			fields: [contactPageVisitTable.contactId],
			references: [contactTable.id],
		}),
		user: one(userTable, {
			fields: [contactPageVisitTable.userId],
			references: [userTable.id],
		}),
	}),
);

export const contactTaskRelations = relations(contactTaskTable, ({ one }) => ({
	contact: one(contactTable, {
		fields: [contactTaskTable.contactId],
		references: [contactTable.id],
	}),
}));

export const favoriteRelations = relations(favoriteTable, ({ one }) => ({
	contact: one(contactTable, {
		fields: [favoriteTable.contactId],
		references: [contactTable.id],
	}),
	user: one(userTable, {
		fields: [favoriteTable.userId],
		references: [userTable.id],
	}),
}));

export const invitationRelations = relations(invitationTable, ({ one }) => ({
	organization: one(organizationTable, {
		fields: [invitationTable.organizationId],
		references: [organizationTable.id],
	}),
}));

export const accountRelations = relations(accountTable, ({ one }) => ({
	user: one(userTable, {
		fields: [accountTable.userId],
		references: [userTable.id],
	}),
}));

export const feedbackRelations = relations(feedbackTable, ({ one }) => ({
	organization: one(organizationTable, {
		fields: [feedbackTable.organizationId],
		references: [organizationTable.id],
	}),
	user: one(userTable, {
		fields: [feedbackTable.userId],
		references: [userTable.id],
	}),
}));

export const notificationRelations = relations(
	notificationTable,
	({ one }) => ({
		user: one(userTable, {
			fields: [notificationTable.userId],
			references: [userTable.id],
		}),
	}),
);

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id],
	}),
}));

export const workHoursRelations = relations(
	workHoursTable,
	({ one, many }) => ({
		organization: one(organizationTable, {
			fields: [workHoursTable.organizationId],
			references: [organizationTable.id],
		}),
		workTimeSlots: many(workTimeSlotTable),
	}),
);

export const workTimeSlotRelations = relations(
	workTimeSlotTable,
	({ one }) => ({
		workHour: one(workHoursTable, {
			fields: [workTimeSlotTable.workHoursId],
			references: [workHoursTable.id],
		}),
	}),
);

export const contactActivityRelations = relations(
	contactActivityTable,
	({ one }) => ({
		contact: one(contactTable, {
			fields: [contactActivityTable.contactId],
			references: [contactTable.id],
		}),
	}),
);

export const webhookRelations = relations(webhookTable, ({ one }) => ({
	organization: one(organizationTable, {
		fields: [webhookTable.organizationId],
		references: [organizationTable.id],
	}),
}));

export const membershipRelations = relations(membershipTable, ({ one }) => ({
	user: one(userTable, {
		fields: [membershipTable.userId],
		references: [userTable.id],
	}),
	organization: one(organizationTable, {
		fields: [membershipTable.organizationId],
		references: [organizationTable.id],
	}),
}));

export const organizationLogoRelations = relations(
	organizationLogoTable,
	({ one }) => ({
		organization: one(organizationTable, {
			fields: [organizationLogoTable.organizationId],
			references: [organizationTable.id],
		}),
	}),
);

export const subscriptionRelations = relations(
	subscriptionTable,
	({ one }) => ({
		organization: one(organizationTable, {
			fields: [subscriptionTable.organizationId],
			references: [organizationTable.id],
		}),
	}),
);

export const subscriptionItemRelations = relations(
	subscriptionItemTable,
	({ one }) => ({
		organization: one(subscriptionTable, {
			fields: [subscriptionItemTable.subscriptionId],
			references: [subscriptionTable.id],
		}),
	}),
);

export const orderRelations = relations(orderTable, ({ one }) => ({
	organization: one(organizationTable, {
		fields: [orderTable.organizationId],
		references: [organizationTable.id],
	}),
}));

export const orderItemRelations = relations(orderItemTable, ({ one }) => ({
	organization: one(orderTable, {
		fields: [orderItemTable.orderId],
		references: [orderTable.id],
	}),
}));

export const contactTagRelations = relations(contactTagTable, ({ many }) => ({
	contactToContactTags: many(contactToContactTagTable),
}));

export const contactToContactTagRelations = relations(
	contactToContactTagTable,
	({ one }) => ({
		contact: one(contactTable, {
			fields: [contactToContactTagTable.contactId],
			references: [contactTable.id],
		}),
		contactTag: one(contactTagTable, {
			fields: [contactToContactTagTable.contactTagId],
			references: [contactTagTable.id],
		}),
	}),
);

export const applicationRelations = relations(applicationTable, ({ one }) => ({
	organization: one(organizationTable, {
		fields: [applicationTable.organizationId],
		references: [organizationTable.id],
	}),
	opportunity: one(opportunityTable, {
		fields: [applicationTable.opportunityId],
		references: [opportunityTable.id],
	}),
}));
