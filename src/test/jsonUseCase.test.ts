import assert from 'assert';
import path from 'path';
import { getClient } from '../postgres';
import * as jsonUseCase from '../jsonUseCase';
import * as entryUseCase from '../entryUseCase';
import { Entry } from '../entryEntity';
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function';
import { tap } from '../functions';
 
describe('jsonUseCase', () => {
  it('importAll', async () => {
    await pipe(
      TE.right(path.resolve(__dirname, '..', '..', 'assets', 'dayone-210415.json')),
      TE.chain(jsonUseCase.importAll(getClient)),
//      TE.chain((entries: Entry[]) => entryUseCase.deleteAll(getClient)(entries.map(entry => entry.uuid)))
    )();
  });
});
