import { PoolClient } from 'pg';

export const selectAll = (client: PoolClient) => {
  return async ({ uuid }: { uuid: string }) => {
    const sql = `
      SELECT *
      FROM
        tags
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];
    const queryResult = await client.query(sql, params);
    return queryResult.rows;
  };
};

export const insertAll = (client: PoolClient) => {
  return async ({
    uuid,
    tags,
  }: {
    uuid: string;
    tags: string[] | null;
  }): Promise<void> => {
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
    if (queryResult.rowCount !== tags.length) throw new Error('unexpected rowCount');
  };
};

export const updateAll = (client: PoolClient) => {
  return async ({
    uuid,
    tags,
  }: {
    uuid: string;
    tags: string[];
  }): Promise<boolean | undefined> => {
    const deleteResult = await deleteAll(client)({ uuid });
    const insertResult = await insertAll(client)({ uuid, tags });
    // TODO: 削除する
    return true;
  };
};

export const deleteAll = (client: PoolClient) => {
  return async ({ uuid }: { uuid: string }): Promise<string | undefined> => {
    const sql = `
      DELETE
      FROM
        tags
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount === 0) return undefined;
    return uuid;
  };
};

/**
  INSERT INTO tags (
    uuid
    ,tag
  )
  VALUES (
    $1
    ,$2
  ), (
    $1
    ,$3
  )
  ;
*/
