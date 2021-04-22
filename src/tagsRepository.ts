import { PoolClient } from 'pg';
import Boom from '@hapi/boom';

export const insertAll = (client: PoolClient) => {
  return async (tags: string[] | null, uuid: string): Promise<void> => {
    if (!tags) return;
    const sql = `
      INSERT INTO tags (
        uuid
        ,tag
      )
      VALUES ${tags
        .map(
          (_, i) => `(
        $1
        ,$${2 + i}
      )`
        )
        .join(', ')}
      ;`;
    const params = [uuid, ...tags];
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount !== tags.length)
      throw Boom.internal('unexpected rowCount');
  };
};

export const updateAll = (client: PoolClient) => {
  return async (tags: string[] | null, uuid: string): Promise<void> => {
    if (!tags) return;
    const deleteResult = await deleteAll(client)(uuid);
    const insertResult = await insertAll(client)(tags, uuid);
  };
};

export const deleteAll = (client: PoolClient) => {
  return async (uuid: string): Promise<void> => {
    const sql = `
      DELETE
      FROM
        tags
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];
    const queryResult = await client.query(sql, params);
  };
};
