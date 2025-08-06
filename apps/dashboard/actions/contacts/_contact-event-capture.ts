import {
	db,
	eq,
	getTableColumns,
	inArray,
	jsonAggBuildObject,
} from "@workspace/database/client";
import {
	ActionType,
	ActorType,
	contactActivityTable,
	contactTable,
	contactTagTable,
	contactToContactTagTable,
} from "@workspace/database/schema";

/*
   This is an advanced create/update that
    - handles many-to-many (contact -> contactToContactTags <- contactTags) relationships.
    - detects and records changes in a separate table.

  Drizzle is not well equipped to handle many-to-many relationships, so we have to handle them manually.
  But they are working on improving the query API, so this might change in the future.

  Note: If you just want to see normal create/update, look into the createContact and updateContact actions.
*/

const fieldsToCheck = [
	"record",
	"image",
	"name",
	"email",
	"address",
	"phone",
	"stage",
	"tags",
] as const;

type FieldToCheck = (typeof fieldsToCheck)[number];

type Tag = {
	id?: string;
	text: string;
};

type ChangeEntry = {
	old: string | null;
	new: string | null;
};

type ContactChanges = {
	[K in FieldToCheck]?: ChangeEntry;
};

type Contact = typeof contactTable.$inferSelect;
type ContactWithTags = Contact & {
	tags: Tag[];
};

function safeStringify<T>(value: T): string | null {
	if (value === null || value === undefined) {
		return null;
	}
	return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function joinTags(tags: { text: string }[]): string {
	return [...new Set(tags.map((tag) => tag.text))].sort().join(",");
}

export function detectChanges(
	currentContact: Partial<ContactWithTags> | null,
	updatedContact: ContactWithTags,
	updateData?: Partial<Contact>,
): ContactChanges {
	const changes: ContactChanges = {};

	for (const field of fieldsToCheck) {
		if (field === "tags") {
			const oldTags = currentContact?.tags
				? joinTags(currentContact.tags)
				: null;
			const newTags = joinTags(updatedContact.tags);
			if (oldTags !== newTags) {
				changes.tags = { old: oldTags, new: newTags };
			}
		} else {
			const oldValue = currentContact
				? safeStringify(currentContact[field as keyof Contact])
				: null;
			const newValue = safeStringify(updatedContact[field as keyof Contact]);
			if (oldValue !== newValue && (!updateData || field in updateData)) {
				changes[field] = { old: oldValue, new: newValue };
			}
		}
	}

	return changes;
}

export async function createContactAndCaptureEvent(
	contactData: Omit<
		Contact,
		"id" | "createdAt" | "updatedAt" | "organizationId"
	> & {
		createdAt?: Date;
		organizationId: string;
		tags?: Tag[];
	},
	actorId: string,
): Promise<ContactWithTags> {
	return await db.transaction(async (tx) => {
		const { tags, ...contactValues } = contactData;
		const createdAt = contactValues.createdAt ?? new Date();

		// Insert new contact
		const newContact = await tx
			.insert(contactTable)
			.values({
				...contactValues,
				createdAt,
				updatedAt: createdAt,
			})
			.returning()
			.then((rows) => ({
				...rows[0],
				tags: [] as Required<Tag>[],
			}));

		// Handle tags
		if (tags && tags.length > 0) {
			// Find existing tags
			const existingTags = await tx
				.select({ id: contactTagTable.id, text: contactTagTable.text })
				.from(contactTagTable)
				.where(
					inArray(
						contactTagTable.text,
						tags.map((tag) => tag.text),
					),
				);
			const existingTagTexts = new Set(existingTags.map((tag) => tag.text));

			// Insert missing tags
			const newTags = tags.filter((tag) => !existingTagTexts.has(tag.text));
			let insertedTags: Required<Tag>[] = [];
			if (newTags.length > 0) {
				insertedTags = await tx
					.insert(contactTagTable)
					.values(newTags.map(({ text }) => ({ text })))
					.returning({ id: contactTagTable.id, text: contactTagTable.text });
			}

			newContact.tags = [...existingTags, ...insertedTags];

			// Insert relationships
			if (newContact.tags.length > 0) {
				await tx.insert(contactToContactTagTable).values(
					newContact.tags.map(({ id }) => ({
						contactId: newContact.id,
						contactTagId: id,
					})),
				);
			}
		}

		// Detect changes (initial contact creation)
		const changes = detectChanges(null, newContact);

		// Record changes
		await tx.insert(contactActivityTable).values({
			contactId: newContact.id,
			actionType: ActionType.CREATE,
			actorId,
			actorType: ActorType.MEMBER,
			metadata: changes,
			occurredAt: createdAt,
		});

		return newContact;
	});
}

export async function updateContactAndCaptureEvent(
	contactId: string,
	updateData: Partial<
		Omit<
			typeof contactTable.$inferInsert,
			"id" | "createdAt" | "updatedAt" | "organizationId"
		> & {
			tags?: Tag[];
		}
	>,
	actorId: string,
): Promise<ContactChanges> {
	const { tags, ...contactValues } = updateData;
	return db.transaction(async (tx) => {
		// Get current state
		const [currentContact] = await tx
			.select({
				...getTableColumns(contactTable),
				tags: jsonAggBuildObject({
					id: contactTable.id,
					text: contactTagTable.text,
				}),
			})
			.from(contactTable)
			.leftJoin(
				contactToContactTagTable,
				eq(contactTable.id, contactToContactTagTable.contactId),
			)
			.leftJoin(
				contactTagTable,
				eq(contactToContactTagTable.contactTagId, contactTagTable.id),
			)
			.where(eq(contactTable.id, contactId))
			.groupBy(contactTable.id);

		if (!currentContact) {
			throw new Error("Contact not found");
		}

		// Update
		const updatedContact =
			Object.keys(contactValues).length > 0
				? await tx
						.update(contactTable)
						.set(contactValues)
						.where(eq(contactTable.id, contactId))
						.returning()
						.then((rows) => ({
							...rows[0],
							tags: currentContact.tags,
						}))
				: Object.assign({}, currentContact);

		if (tags && tags.length > 0) {
			// Remove existing tag relationships
			await tx
				.delete(contactToContactTagTable)
				.where(eq(contactToContactTagTable.contactId, contactId));

			// Add new tags and relationships
			updatedContact.tags = [];
			for (const tag of tags) {
				// Find or create tag
				const [existingTag] = await tx
					.select({ id: contactTagTable.id })
					.from(contactTagTable)
					.where(
						tag.id
							? eq(contactTagTable.id, tag.id)
							: eq(contactTagTable.text, tag.text),
					);

				let contactTagId = existingTag?.id;
				if (!contactTagId) {
					const [newTag] = await tx
						.insert(contactTagTable)
						.values({ id: tag.id, text: tag.text })
						.returning({ id: contactTable.id });
					contactTagId = newTag.id;
				}

				// Create relationship
				await tx.insert(contactToContactTagTable).values({
					contactId,
					contactTagId,
				});

				// Store updated tag
				updatedContact.tags.push({
					id: contactTagId,
					text: tag.text,
				});
			}
		}

		// Record changes
		const changes = detectChanges(
			currentContact,
			updatedContact,
			contactValues,
		);

		if (Object.keys(changes).length > 0) {
			await tx.insert(contactActivityTable).values({
				contactId,
				actionType: ActionType.UPDATE,
				actorId,
				actorType: ActorType.MEMBER,
				metadata: changes,
				occurredAt: new Date(),
			});
		}

		return changes;
	});
}
