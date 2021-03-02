import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export type IDbExecutable = (sql: string, params?: (string|number|boolean)[]) => Promise<QueryResult>;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
