import assert from 'assert';
import { getClient } from '../postgres';
import * as entriesRepository from '../entriesRepository';

describe('entriesRepository', () => {
  it('selectByKeyword', async () => {
    const keyword = '。';
    const limit = 3;
    const entries = await entriesRepository.selectByKeyword({ keyword, limit });
    assert.strictEqual(entries.length, limit);
  });
  it('selectByTag', async () => {
    const tag = '演技';
    const limit = 3;
    const dbInvoker = entriesRepository.selectByTag(await getClient());
    const entries = await dbInvoker(tag, limit);
    assert.strictEqual(entries.length, limit);
  });
});
