import * as TE from 'fp-ts/lib/TaskEither'
import { identity } from 'fp-ts/lib/function';
import { PoolClient } from 'pg';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

export const createOne = (client: PoolClient) => (entry: Entry) : TE.TaskEither<any, any> => {
  const entriesInvoker = entriesRepository.insertOne(client);
  const tagsInvoker = tagsRepository.insertAll(client);
  return TE.tryCatch(
    () => Promise.all([entriesInvoker(entry), tagsInvoker(entry.tags, entry.uuid)]).then(_ => entry),
    identity
  )
};

export const readAll = (client: PoolClient) => (limit: number): Promise<Entry[]> => {
  const dbInvoker = entriesRepository.selectAll(client);
  return dbInvoker(limit);
};

export const readOne = (client: PoolClient) => (uuid: string): Promise<Entry> => {
  const dbInvoker = entriesRepository.selectOne(client);
  return dbInvoker(uuid);
};

export const updateOne = (client: PoolClient) => (entry: Entry): Promise<Entry> => {
  const entriesInvoker = entriesRepository.updateOne(client);
  const tagsInvoker = tagsRepository.updateAll(client);
  return Promise.all([entriesInvoker(entry), tagsInvoker(entry.tags, entry.uuid)])
    .then(_ => entry)
};

export const deleteOne = (client: PoolClient) => (uuid: string): Promise<string> => {
  const entriesInvoker = entriesRepository.deleteOne(client);
  const tagsInvoker = tagsRepository.deleteAll(client);
  return Promise.all([entriesInvoker(uuid), tagsInvoker(uuid)])
    .then(_ => uuid);
};
