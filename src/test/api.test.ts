import assert from 'assert';
import fetch from 'node-fetch';
import { Entry } from '../entryEntity';

describe('Api', () => {
  it('Create', () => {
    const entry = {
      text: '本文',
      tags: ['タグ1', 'タグ2'],
    };
    fetch(`http://localhost:3000/api/entries/create`, {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    })
    .then(response => response.json())
    .then(data => assert.equal(data, entry));
  });
});
