import { PoolClient } from 'pg';
import Boom from '@hapi/boom';
import { getClient } from './postgres';
import * as jsonRepository from './jsonRepository';
import * as entryUseCase from './entryUseCase';
import { Entry } from './entryEntity';
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function';

export const readAll = (filePath: string): TE.TaskEither<Boom.Boom<500>, Entry[]> => async () => {
  return jsonRepository.readAll(filePath)
    .then(entries => E.right(entries))
    .catch(err => E.left(Boom.boomify(err)));
};

export const importAll = (getClient: () => Promise<PoolClient>) => (filePath: string): TE.TaskEither<Boom.Boom<500>, Entry[]> => {
  return pipe(
    TE.right(filePath),
    TE.chain(readAll),
    TE.chain(entryUseCase.createAll(getClient)),
  );
};
