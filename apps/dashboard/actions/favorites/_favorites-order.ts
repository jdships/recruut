import { sql, type db } from '@workspace/database/client';

export async function updateFavoritesOrder(
  tx: Pick<typeof db, 'execute'>,
  userId?: string
): Promise<void> {
  if (userId) {
    await tx.execute(sql`
      UPDATE "public"."favorite"
      SET "order" = numbered_table.new_order
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY "order" ASC) AS new_order
        FROM "public"."favorite"
        WHERE "public"."favorite"."userId" = ${userId}::uuid
      ) numbered_table
      WHERE "public"."favorite".id = numbered_table.id
      AND "public"."favorite"."userId" = ${userId}::uuid;
    `);
    return;
  }

  await tx.execute(sql`
    UPDATE "public"."favorite"
    SET "order" = numbered_table.new_order
    FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "order" ASC) AS new_order
      FROM "public"."favorite"
    ) numbered_table
    WHERE "public"."favorite".id = numbered_table.id;
  `);
}
