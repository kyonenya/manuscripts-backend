import { executor } from './postgres';
import { QueryResult } from 'pg';

export type dbExecutable = (sql: string, params?: (string|number)[]) => Promise<QueryResult>;

export const selectAll = (executor: dbExecutable) => {
  return async ({ limit }: { limit: number }) => {
    const sql = `
      SELECT *
      FROM manuscripts
      ORDER BY created_at DESC
      LIMIT $1
      ;`;
    const params = [limit];
    try {
      const queryResult = await executor(sql, params);
      console.log(queryResult.rowCount);
    } catch (err) {
      console.error(err);
    }
  };
};

selectAll(executor)({ limit: 3 });
