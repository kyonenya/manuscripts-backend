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
  it('Create', async () => {
    const entry = {
      text: '本文',
      tags: ['タグ1', 'タグ2'],
      uuid,
    };
    const result = await fetcher({
      url: `${baseUrl}/api/entries/create`,
      method: 'POST',
      body: entry,
    });
    assert.equal(result.text, entry.text);
  });
  it('Update', async () => {
    const entry = {
      text: '更新された本文',
      tags: ['更新されたタグ1', '更新されたタグ2'],
      starred: true,
      uuid,
     };
    const result = await fetcher({
      url: `${baseUrl}/api/entries/${uuid}`,
      method: 'PUT',
      body: entry,
    });
    assert.equal(uuid, result.uuid);
  });
  it('Delete', async () => {
    const result = await fetcher({
      url: `${baseUrl}/api/entries/${uuid}`,
      method: 'DELETE',
    });
    assert.equal(uuid, result);
  });
});
