import assert from 'assert';
import fetch from 'node-fetch';
import { Entry } from '../entryEntity';

const fetcher = async ({ url, method, body }: {
  url: string,
  method: string,
  body?: unknown,
}) => await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
  }).then(response => response.json());

describe('Api', () => {
  const uuid = '8cb4f18cccdf4422b54010fd96711ee9';
  const baseUrl = 'http://localhost:3000';
  const entry = {
    text: '本文',
    tags: ['タグ1', 'タグ2'],
    uuid,
  };
  it('Create', async () => {
    const result = await fetcher({
      url: `${baseUrl}/api/entries/create`,
      method: 'POST',
      body: entry,
    });
    assert.strictEqual(result.text, entry.text);
    assert.deepStrictEqual(result.tags, entry.tags);
  });
  it('ReadOne', async () => {
    const result = await fetcher({
      url: `${baseUrl}/api/entries/${uuid}`,
      method: 'GET',
    });
    assert.strictEqual(result.text, entry.text);
    assert.deepStrictEqual(result.tags, entry.tags);
  });
  it('ReadAll limit=3', async () => {
    const limit = 3;
    const result = await fetcher({
      url: `${baseUrl}/api/entries?limit=${limit}`,
      method: 'GET',
    });
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].text, entry.text);
  });
  it('Update', async () => {
    const entry2 = {
      text: '更新された本文',
      tags: ['更新されたタグ1', '更新されたタグ2'],
      starred: true,
      uuid,
     };
    const result = await fetcher({
      url: `${baseUrl}/api/entries/${uuid}`,
      method: 'PUT',
      body: entry2,
    });
    assert.strictEqual(result.uuid, uuid);
    assert.strictEqual(result.text, entry2.text);
    assert.strictEqual(result.starred, entry2.starred);
  });
  it('Delete', async () => {
    const result = await fetcher({
      url: `${baseUrl}/api/entries/${uuid}`,
      method: 'DELETE',
    });
    assert.strictEqual(result, uuid);
  });
});
