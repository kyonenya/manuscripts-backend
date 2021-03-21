import { PoolClient } from 'pg';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Entry } from './entryEntity';

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
