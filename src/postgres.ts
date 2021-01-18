import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { dbExecutable } from './entriesRepository';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const executor: dbExecutable = async (sql, params?): Promise<QueryResult> => {
  return pool.query(sql, params);
};
