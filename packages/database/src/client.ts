import {
  and,
  is,
  sql,
  SQL,
  type AnyColumn,
  type Column,
  type GetColumnData,
  type SelectedFields,
  type Table
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { PgTimestampString } from 'drizzle-orm/pg-core';
import { type SelectResultFields } from 'drizzle-orm/query-builders/select.types';
import { Pool } from 'pg';

import { keys } from '../keys';
import * as schema from './schema';

const pool = new Pool({
  connectionString: keys().DATABASE_URL
});
export const db = drizzle(pool, { schema });

export * from 'drizzle-orm';

export type DatabaseType = typeof db;
export type TransactionType = Parameters<Parameters<DatabaseType['transaction']>[0]>[0];

// Helpers

function jsonBuildObject<T extends SelectedFields<Column, Table>>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape)
    .filter(([_, value]) => value)
    .forEach(([key, value]) => {
      if (chunks.length > 0) {
        chunks.push(sql.raw(`,`));
      }

      chunks.push(sql.raw(`'${key}',`));

      if (is(value, PgTimestampString)) {
        chunks.push(sql`timezone('UTC', ${value})`);
      } else {
        chunks.push(sql`${value}`);
      }
    });

  return sql<SelectResultFields<T>>`json_build_object(${sql.join(chunks)})`;
}

export function coalesce<T>(value: SQL.Aliased<T> | SQL<T>, defaultValue: SQL) {
  return sql<T>`coalesce(${value}, ${defaultValue})`;
}

export function jsonAggBuildObject<
  T extends SelectedFields<Column, Table>,
  Column extends AnyColumn
>(shape: T) {
  return sql<SelectResultFields<T>[]>`coalesce(
    json_agg(${jsonBuildObject(shape)})
    FILTER (WHERE ${and(
    sql.join(
      Object.values(shape)
        .filter((value) => value)
        .map((value) => sql`${sql`${value}`} IS NOT NULL`),
      sql` AND `
    )
  )})
    ,'${sql`[]`}')`;
}

export function arrayAgg<Column extends AnyColumn>(column: Column) {
  return coalesce<GetColumnData<Column, 'raw'>[]>(
    sql`json_agg(distinct ${sql`${column}`}) filter (where ${column} is not null)`,
    sql`'[]'`
  );
}
