import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://localhost:5432/postgres',
});

export const db = drizzle(pool);
