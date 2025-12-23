import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Missing DATABASE_URL. Set it to your Supabase Postgres connection string (prefer the pooler/transaction URL).'
  );
}

const sql = postgres(databaseUrl, { prepare: false });

export const db = drizzle(sql, { schema });
