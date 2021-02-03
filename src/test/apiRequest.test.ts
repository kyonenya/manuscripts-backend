import assert from 'assert';
import * as apiRequest from '../apiRequest';
import { Entry } from '../entryEntity';

describe('apiRequest', () => {
  it('starred', () => {
    assert.deepStrictEqual(apiRequest.entitize({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
      uuid: '0fd96711ee98cb4f18cccdf4422b5401',
    }), new Entry({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
      uuid: '0fd96711ee98cb4f18cccdf4422b5401',
      starred: false,
      created_at: undefined,
      modified_at: undefined,
    }))
  });
});
