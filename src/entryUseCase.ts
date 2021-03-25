import * as TE from 'fp-ts/lib/TaskEither'
import { identity } from 'fp-ts/lib/function';
import { PoolClient } from 'pg';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

export const createOneEntry = ({ entry, entriesInvoker, tagsInvoker }: {
  entry: Entry,
  entriesInvoker: (entry: Entry) => Promise<void>,
  tagsInvoker: (tags: string[]|null, uuid: string) => Promise<void>,
}): Promise<Entry> => {
  return Promise.all([entriesInvoker(entry), tagsInvoker(entry.tags, entry.uuid)])
    .then(_ => entry)
};

export const createOneEntry2 = ({ entriesInvoker, tagsInvoker }: {
  entriesInvoker: (entry: Entry) => Promise<void>,
  tagsInvoker: (tags: string[]|null, uuid: string) => Promise<void>,
}) => (entry: Entry) : TE.TaskEither<any, any> => {
  return TE.tryCatch(
    () => Promise.all([entriesInvoker(entry), tagsInvoker(entry.tags, entry.uuid)]).then(_ => entry),
    identity
  )
};

export const deleteOneEntry = ({ client, uuid }: {
  client: PoolClient,
  uuid: string,
}): Promise<Entry['uuid'] | null> => {
  const entriesInvoker = entriesRepository.deleteOne(client);
  const tagsInvoker = tagsRepository.deleteAll(client);
  return Promise
    .all([entriesInvoker(uuid), tagsInvoker(uuid)])
    .then((results) => results[0]);
};
