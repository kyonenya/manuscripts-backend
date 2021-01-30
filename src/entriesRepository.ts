import { QueryResult } from 'pg';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

export type dbExecutable = (sql: string, params?: (string|number|boolean)[]) => Promise<QueryResult>;

type dbSchemable = {
  text: string,
  starred: boolean,
  uuid: string,
  taglist: string|null,
  created_at: string,
  modified_at: string,
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

export const selectAll = (executor: dbExecutable) => {
  return async ({ limit }: { limit: number }): Promise<Entry[]|undefined> => {
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
      const queryResult = await executor(sql, params);
      return queryResult.rows.map(row => entitize(row));
    } catch (err) {
      console.error(err);
    }
  };
};

export const selectOne = (executor: dbExecutable) => {
  return async ({ uuid }: { uuid: string }): Promise<Entry[]|undefined> => {
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
      const queryResult = await executor(sql, params);
      return queryResult.rows.map(row => entitize(row));
    } catch (err) {
      console.error(err);
    }
  };
};

export const insertOne = (executor: dbExecutable) => {
  return async (entry: Entry): Promise<Entry|undefined> => {
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
      const queryResult = await executor(sql, params);
      if (entry.tags) {
        await tagsRepository.insertAll(executor)({
          uuid: entry.uuid,
          tags: entry.tags,
        });
      }
      if (queryResult.rowCount === 1) {
        return entry;
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const updateOne = (executor: dbExecutable) => {
  return async (entry: Entry) => {
    console.log(entry);
    const sql = `
      UPDATE
        entries
      SET
        text = $1
        ,starred = $2
      WHERE uuid = $3
      ;`;
    const params = [entry.text, entry.starred, entry.uuid];

    try {
      const queryResult = await executor(sql, params);
      if (!entry.tags) return;
      await tagsRepository.updateAll(executor)({
        uuid: entry.uuid,
        tags: entry.tags,
      })
    } catch (err) {
      console.error(err);
    }
  }
};

export const deleteOne = (executor: dbExecutable) => {
  return async ({ uuid }: { uuid: string }): Promise<Entry['uuid']|undefined> => {
    const sql = `
      DELETE
      FROM
        entries
      WHERE
        uuid = $1
      ;`;
    const params = [uuid];

    try {
      const queryResult = await executor(sql, params);
      await tagsRepository.deleteAll(executor)({ uuid });
      if (queryResult.rowCount === 1) {
        return uuid;
      }
    } catch (err) {
      console.error(err);
    }
  }
};
