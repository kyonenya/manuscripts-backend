import { PoolClient } from 'pg';
import Boom from '@hapi/boom';
import dayjs from 'dayjs';
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
  return async (limit: number): Promise<Entry[]> => {
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
    const queryResult = await client.query(sql, params);
    return queryResult.rows.map((row) => entitize(row));
  };
};

export const selectAllByKeyword = (client: PoolClient) => {
  return async (keyword: string, limit: number): Promise<Entry[]> => {
    const sql = `
      SELECT
        entries.*
        ,STRING_AGG(tags.tag, ',') AS taglist
      FROM
        entries
        LEFT JOIN
          tags
        ON entries.uuid = tags.uuid
      GROUP BY
        entries.uuid
      HAVING entries.text LIKE '%' || $1 || '%'
      ORDER BY
        entries.created_at DESC
      LIMIT $2;`;
    const params = [keyword, limit];
    const queryResult = await client.query(sql, params);
    return queryResult.rows.map((row) => entitize(row));
  };
};

export const selectAllByTag = (client: PoolClient) => {
  return async (tag: string, limit: number): Promise<Entry[]> => {
    const sql = `
      SELECT
        entries.*
        ,STRING_AGG(tags.tag, ',') AS taglist
      FROM
        entries
        LEFT JOIN
          tags
        ON  entries.uuid = tags.uuid
      GROUP BY
        entries.uuid
      HAVING entries.uuid IN(
        SELECT
          uuid
        FROM
          tags
        WHERE
          tag = $1
      )
      ORDER BY
        entries.created_at DESC
      LIMIT $2
      ;`;
    const params = [tag, limit];
    const queryResult = await client.query(sql, params);
    return queryResult.rows.map((row) => entitize(row));
  };
};

export const selectOne = (client: PoolClient) => {
  return async (uuid: string): Promise<Entry> => {
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
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount !== 1) throw Boom.notFound('指定された記事は存在しません');
    return entitize(queryResult.rows[0]);
  };
};

export const insertOne = (client: PoolClient) => {
  return async (entry: Entry): Promise<void> => {
    const sql = `
      INSERT INTO entries (
        text
        ,starred
        ,uuid
        ,created_at
        ,modified_at
      )
      VALUES (
        $1
        ,$2
        ,$3
        ,$4
        ,$5
      )
      ;`;
    const params = [
      entry.text,
      entry.starred,
      entry.uuid,
      entry.created_at ?? dayjs().toDate(),
      entry.modified_at ?? dayjs().toDate(),
    ];
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount !== 1) throw Boom.internal('unexpected rowCount');
  };
};

export const updateOne = (client: PoolClient) => {
  return async (entry: Entry): Promise<void> => {
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
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount !== 1) throw Boom.internal('unexpected rowCount');
  };
};

export const deleteOne = (client: PoolClient) => {
  return async (uuid: string): Promise<void> => {
    const sql = `
      DELETE
      FROM
        entries
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];
    const queryResult = await client.query(sql, params);
    if (queryResult.rowCount !== 1) throw Boom.notFound('指定された記事は存在しません');
  };
};
