import { PoolClient } from 'pg';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

export const createOneEntry = ({ client, entry }: {
  client: PoolClient,
  entry: Entry,
}): Promise<Entry> => {
  const entriesInvoker = entriesRepository.insertOne(client);
  const tagsInvoker = tagsRepository.insertAll(client);
  return Promise
    .all([entriesInvoker(entry), tagsInvoker({ uuid: entry.uuid, tags: entry.tags })])
    .then(_ => entry)
};

export const deleteOneEntry = ({ client, uuid }: {
  client: PoolClient,
  uuid: string,
}): Promise<Entry['uuid'] | null> => {
  const entriesInvoker = entriesRepository.deleteOne(client);
  const tagsInvoker = tagsRepository.deleteAll(client);
  return Promise
    .all([entriesInvoker({ uuid }), tagsInvoker({ uuid })])
    .then((results) => results[0]);
};
