import assert from 'assert';
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as entryUseCase from '../entryUseCase';
import { getClient } from '../postgres';
import { Entry } from '../entryEntity';

describe('entryUseCase', () => {
  const entries = [
    new Entry({
      text: '本文1',
      tags: ['タグ1', 'タグ2'],
      uuid: 'c947165469d44e66bcf6314797035ba0',
    }),
    new Entry({
      text: '本文2',
      tags: null,
      uuid: '6314797035ba0c947165469d44e66bcf',
    }),
  ];
  it('createAll', async () => {
    const result = await entryUseCase.createAll(getClient)(entries)();
    assert.ok(E.isRight(result));
  });
  it('deleteAll', async () => {
    const result = await entryUseCase.deleteAll(getClient)(entries.map(entry => entry.uuid))();
    assert.ok(E.isRight(result));
  });
});
