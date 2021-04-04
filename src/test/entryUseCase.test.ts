import assert from 'assert';
import * as TE from 'fp-ts/lib/TaskEither'
import * as entryUseCase from '../entryUseCase';
import { getClient } from '../postgres';
import { Entry } from '../entryEntity';

describe('entryUseCase', () => {
  it('createAll', async () => {
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
    const result = await entryUseCase.createAll(getClient)(entries)();
  });
});
