import assert from 'assert';
import path from 'path';
import { getClient } from '../postgres';
import * as jsonUseCase from '../jsonUseCase';
import * as entryUseCase from '../entryUseCase';
import { Entry } from '../entryEntity';
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function';

describe('jsonUseCase', () => {
  it('importAll', async () => {
    const filePath = path.resolve(__dirname, '..', '..', 'assets', 'dayone-210320.json');
    const resultEither = await jsonUseCase.importAll(getClient)(filePath)();
    assert.ok(E.isRight(resultEither));
    pipe(
      TE.fromEither(resultEither),
      TE.map((entries: Entry[]) => entryUseCase.deleteAll(getClient)(entries.map(entry => entry.uuid)))
    )();
  });
});
