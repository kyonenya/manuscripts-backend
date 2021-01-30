import { executor } from './postgres';
import { QueryResult } from 'pg';
import { Entry } from './entryEntity';

export type dbExecutable = (sql: string, params?: (string|number|boolean)[]) => Promise<QueryResult>;

export const insertOne = (executor: dbExecutable) => {
  return async ({ uuid, tag }: {
    uuid: string,
    tag: string,
  }): Promise<boolean|undefined> => {
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
      if (queryResult.rowCount === 1) {
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const insertAll =  (executor: dbExecutable) => {
  return async ({ uuid, tags }: {
    uuid: string,
    tags: string[],
  }): Promise<number|undefined> => {
    let count = 0;
    for await (const tag of tags) {
      const result = await insertOne(executor)({ uuid, tag });
      if (result === true) count++;
    }
    return count;
  }
};

export const updateAll = (executor: dbExecutable) => {
  return async ({ uuid, tags }: {
    uuid: string,
    tags: string[],
  }): Promise<boolean|undefined> => {
    const deleteResult = await deleteAll(executor)({ uuid });
    const insertResult = await insertAll(executor)({ uuid, tags });
    if (deleteResult === tags.length && insertResult === tags.length) {
      return true;
    }
  }
};

export const deleteAll = (executor: dbExecutable) => {
  return async ({ uuid }: { uuid: string }): Promise<number|undefined> => {
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
      if (queryResult.rowCount >= 1) {
        return queryResult.rowCount;
      }
    } catch (err) {
      console.error(err);
    }
  }
};
