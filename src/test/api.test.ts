import assert from 'assert';
import fetch from 'node-fetch';
import { Entry } from '../entryEntity';

describe('Api', () => {
  it('Create', async () => {
    // Create
    const entry = {
      text: '本文',
      tags: ['タグ1', 'タグ2'],
    };
    const created = await fetch(`http://localhost:3000/api/entries/create`, {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    })
    .then(response => response.json());
    assert.equal(created.text, entry.text);
    
    // Delete
    const deletedUuid = await fetch(`http://localhost:3000/api/entries/${created.uuid}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json());
    assert.equal(created.uuid, deletedUuid);
  });
});
