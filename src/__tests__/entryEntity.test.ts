import assert from 'assert';
import { Entry } from '../entryEntity';

describe('new Entry', () => {
  it('supplement', () => {
    assert.deepStrictEqual(new Entry({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
      uuid: 'c947165469d44e66bcf6314797035ba0',
    }), new Entry({
      created_at: undefined,
      modified_at: undefined,
      starred: false,
      tags: ['タグ1', 'タグ2'],
      text: '本文',
      uuid: 'c947165469d44e66bcf6314797035ba0',
    }));
  });
});
