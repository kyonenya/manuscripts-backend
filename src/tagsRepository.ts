import { executor } from './postgres';
import { QueryResult } from 'pg';
import { Entry } from './entryEntity';

export type dbExecutable = (sql: string, params?: (string|number|boolean)[]) => Promise<QueryResult>;

export const deleteAll = (executor: dbExecutable) => {
  return async ({ uuid }: { uuid: string }) => {
    const sql = `
      DELETE
      FROM
        tags
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];

    try {
      const queryResult = await executor(sql, params);
    } catch (err) {
      console.error(err);
    }
  }
};
