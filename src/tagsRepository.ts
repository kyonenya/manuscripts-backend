import { IDbExecutable } from './postgres';
import { QueryResult, PoolClient } from 'pg';
import { Entry } from './entryEntity';

export const insertOne = (client: PoolClient) => {
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
      const queryResult = await client.query(sql, params);
      if (queryResult.rowCount === 1) {
        return true;
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const insertAll =  (client: PoolClient) => {
  return async ({ uuid, tags }: {
    uuid: string,
    tags: string[],
  }): Promise<number|undefined> => {
    let count = 0;
    for await (const tag of tags) {
      const result = await insertOne(client)({ uuid, tag });
      if (result === true) count++;
    }
    return count;
  }
};

export const updateAll = (client: PoolClient) => {
  return async ({ uuid, tags }: {
    uuid: string,
    tags: string[],
  }): Promise<boolean|undefined> => {
    const deleteResult = await deleteAll(client)({ uuid });
    const insertResult = await insertAll(client)({ uuid, tags });
    if (deleteResult === tags.length && insertResult === tags.length) {
      return true;
    }
  }
};

export const deleteAll = (client: PoolClient) => {
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
      const queryResult = await client.query(sql, params);
      if (queryResult.rowCount >= 1) {
        return queryResult.rowCount;
      }
    } catch (err) {
      console.error(err);
    }
  }
};
