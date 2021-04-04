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
    .catch((err: Error) => E.left(Boom.boomify(err)));
};

export const createAll = (getClient: () => Promise<PoolClient>) => (entries: Entry[]) => {
  return A.array.sequence(TE.taskEitherSeq)(entries.map(entry => createOne(getClient)(entry)));
};

export const readAll = (getClient: () => Promise<PoolClient>) => (limit: number): TE.TaskEither<any, Entry[]> => async () => {
  const dbInvoker = entriesRepository.selectAll(await getClient());
  const result = await dbInvoker(limit);
  return E.right(result);
};

export const readOne = (getClient: () => Promise<PoolClient>) => (uuid: string): TE.TaskEither<any, Entry> => async () => {
  const dbInvoker = entriesRepository.selectOne(await getClient());
  const result = await dbInvoker(uuid);
  return E.right(result);
};

export const updateOne = (getClient: () => Promise<PoolClient>) => (entry: Entry): TE.TaskEither<Boom.Boom, Entry> => async () => {
  const client = await getClient();
  const entriesInvoker = entriesRepository.updateOne(client);
  const tagsInvoker = tagsRepository.updateAll(client);
  return Promise.all([entriesInvoker(entry), tagsInvoker(entry.tags, entry.uuid)])
    .then(_ => E.right(entry))
    .catch((err: Error) => E.left(Boom.boomify(err)));
};

export const deleteOne = (getClient: () => Promise<PoolClient>) => (uuid: string): TE.TaskEither<Boom.Boom, string> => async () => {
  const client = await getClient();
  const entriesInvoker = entriesRepository.deleteOne(client);
  const tagsInvoker = tagsRepository.deleteAll(client);
  return Promise.all([entriesInvoker(uuid), tagsInvoker(uuid)])
    .then(_ => E.right(uuid))
    .catch((err: Error) => E.left(Boom.boomify(err)));
};
