import assert from 'assert';
import { getClient } from '../postgres';
import * as entriesRepository from '../entriesRepository';

describe('entriesRepository', () => {
  it('selectAllByKeyword', async () => {
    const keyword = '。';
    const limit = 3;
    const dbInvoker = entriesRepository.selectAllByKeyword(await getClient());
    const entries = await dbInvoker(keyword, limit);
    assert.strictEqual(entries.length, limit);
  });
});
