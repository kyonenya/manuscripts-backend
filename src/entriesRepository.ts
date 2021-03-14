import { PoolClient } from 'pg';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

type dbSchemable = {
  text: string;
  starred: boolean;
  uuid: string;
  taglist: string | null;
  created_at: string;
  modified_at: string;
};

const entitize = (row: dbSchemable) => {
  return new Entry({
    text: row.text,
    starred: row.starred,
    uuid: row.uuid,
    tags: row.taglist ? row.taglist.split(',') : null,
    created_at: row.created_at,
    modified_at: row.modified_at,
  });
};

export const selectAll = (client: PoolClient) => {
  return async ({ limit }: { limit: number }): Promise<Entry[] | undefined> => {
    const sql = `
      SELECT
        entries.*
        ,STRING_AGG(tags.tag, ',') AS taglist
      FROM entries
        LEFT JOIN tags
          ON entries.uuid = tags.uuid
      GROUP BY
        entries.uuid
      ORDER BY
        entries.created_at DESC
      LIMIT
        $1
      ;`;
    const params = [limit];

    try {
      const queryResult = await client.query(sql, params);
      return queryResult.rows.map((row) => entitize(row));
    } catch (err) {
      console.error(err);
    }
  };
};

export const selectOne = (client: PoolClient) => {
  return async ({ uuid }: { uuid: string }): Promise<Entry | undefined> => {
    const sql = `
      SELECT
        entries.*
        ,STRING_AGG(tags.tag, ',') AS taglist
      FROM entries
        LEFT JOIN tags
          ON entries.uuid = tags.uuid
      GROUP BY
        entries.uuid
      HAVING
        entries.uuid = $1
      ;`;
    const params = [uuid];

    try {
      const queryResult = await client.query(sql, params);
      return entitize(queryResult.rows[0]);
    } catch (err) {
      console.error(err);
    }
  };
};

export const insertOne = (client: PoolClient) => {
  return async (entry: Entry): Promise<Entry | undefined> => {
    const sql = `
      INSERT INTO entries (
        text
        ,starred
        ,uuid
      )
      VALUES (
        $1
        ,$2
        ,$3
      )
      ;`;
    const params = [entry.text, entry.starred, entry.uuid];

    try {
      const queryResult = await client.query(sql, params);
      if (!entry.tags) {
        return queryResult.rowCount === 1 ? entry : undefined;
      }
      const tagsResult = await tagsRepository.insertAll(client)({
        uuid: entry.uuid,
        tags: entry.tags,
      });
      return queryResult.rowCount === 1 && entry.tags.length === tagsResult
        ? entry
        : undefined;
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateOne = (client: PoolClient) => {
  return async (entry: Entry): Promise<Entry | undefined> => {
    const sql = `
      UPDATE
        entries
      SET
        text = $1
        ,starred = $2
      WHERE
        uuid = $3
      ;`;
    const params = [entry.text, entry.starred, entry.uuid];

    try {
      const queryResult = await client.query(sql, params);
      if (!entry.tags) {
        return queryResult.rowCount === 1 ? entry : undefined;
      }
      const tagsResult = await tagsRepository.updateAll(client)({
        uuid: entry.uuid,
        tags: entry.tags,
      });
      return queryResult.rowCount === 1 && tagsResult === true
        ? entry
        : undefined;
    } catch (err) {
      console.error(err);
    }
  };
};

export const deleteOne = (client: PoolClient) => {
  return async ({
    uuid,
  }: {
    uuid: string;
  }): Promise<Entry['uuid'] | null> => {
    const sql = `
      DELETE
      FROM
        entries
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount !== 1) return null;
    return uuid;
  };
};
