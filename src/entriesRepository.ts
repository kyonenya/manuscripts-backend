import { executor } from './postgres';
import { QueryResult } from 'pg';
import { Entry } from './entryEntity';

export type dbExecutable = (sql: string, params?: (string|number)[]) => Promise<QueryResult>;

type dbSchemable = {
  text: string,
  starred: boolean,
  uuid: string,
  created_at: string,
  modified_at: string,
};

const entitize = (row: dbSchemable) => {
  return new Entry({
    text: row.text,
    starred: row.starred,
    uuid: row.uuid,
    created_at: row.created_at,
    modified_at: row.modified_at,
  });
};

export const selectAll = (executor: dbExecutable) => {
  return async ({ limit }: { limit: number }): Promise<Entry[]|undefined> => {
    const sql = `
      SELECT *
      FROM entries
      ORDER BY created_at DESC
      LIMIT $1
      ;`;
    const params = [limit];
    try {
      const queryResult = await executor(sql, params);
      return queryResult.rows.map(row => entitize(row));
    } catch (err) {
      console.error(err);
    }
  };
};
