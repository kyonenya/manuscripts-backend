import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { sequenceT } from 'fp-ts/lib/Apply';
import { identity } from 'fp-ts/lib/function';
import Boom from '@hapi/boom';
import { PoolClient } from 'pg';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

export const createOne = (getClient: () => Promise<PoolClient>) => (entry: Entry): TE.TaskEither<Boom.Boom, Entry> => async () => {
  const client = await getClient();
  const entriesInvoker = entriesRepository.insertOne(client);
  const tagsInvoker = tagsRepository.insertAll(client);
  return Promise.all([entriesInvoker(entry), tagsInvoker(entry.tags, entry.uuid)])
    .then(_ => E.right(entry))
    .catch((err: Error) => E.left(Boom.internal(err.message)));
};

export const createAll = (getClient: () => Promise<PoolClient>) => (entries: Entry[]) => {
  return A.array.sequence(TE.taskEitherSeq)(entries.map(entry => createOne(getClient)(entry)));
};

export const readAll = (getClient: () => Promise<PoolClient>) => (limit: number): TE.TaskEither<any, Entry[]> => async () => {
  const client = await getClient();
  const dbInvoker = entriesRepository.selectAll(client);
  const result = await dbInvoker(limit);
  return E.right(result);
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
