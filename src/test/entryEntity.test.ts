import assert from 'assert';
import { Entry } from '../entryEntity';

describe('Entry', () => {
  it('starred', () => {
    assert.deepStrictEqual(new Entry({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
      uuid: 'c947165469d44e66bcf6314797035ba0',
    }), new Entry({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
      uuid: 'c947165469d44e66bcf6314797035ba0',
      starred: false,
      created_at: undefined,
      modified_at: undefined,
    }));
  });
  it('uuid', () => {
    const entry = new Entry({ text: '', tags: [] });
    assert.ok(/^\w{32}$/.test(entry.uuid));
  })
});
