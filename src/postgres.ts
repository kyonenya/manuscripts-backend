import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export type IDbExecutable = (sql: string, params?: (string|number|boolean)[]) => Promise<QueryResult>;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const executor: IDbExecutable = async (sql, params?): Promise<QueryResult> => {
  return pool.query(sql, params);
};
