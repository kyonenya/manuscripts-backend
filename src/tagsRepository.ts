import { executor } from './postgres';
import { QueryResult } from 'pg';
import { Entry } from './entryEntity';

export type dbExecutable = (sql: string, params?: (string|number|boolean)[]) => Promise<QueryResult>;

export const insertOne = (executor: dbExecutable) => {
  return async ({ uuid, tag }: {
    uuid: string,
    tag: string,
  }) => {
    const sql = `
      INSERT INTO tags (
        uuid
        ,tag
      )
      VALUES (
        $1
        ,$2
      )
    `;
    const params = [uuid, tag];

    try {
      const queryResult = await executor(sql, params);
    } catch (err) {
      console.error(err);
    }
  }
};

export const insertAll =  (executor: dbExecutable) => {
  return async ({ uuid, tags }: {
    uuid: string,
    tags: string[],
  }) => {
    for await (const tag of tags) {
      await insertOne(executor)({ uuid, tag });
    }
  }
};

export const updateAll = (executor: dbExecutable) => {
  return async ({ uuid, tags }: {
    uuid: string,
    tags: string[],
  }) => {
    await deleteAll(executor)({ uuid });
    await insertAll(executor)({ uuid, tags });
  }
};

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
