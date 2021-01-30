import assert from 'assert';
import fetch from 'node-fetch';
import { Entry } from '../entryEntity';

describe('Api', () => {
  it('CRUD', async () => {
    // Create
    const entry1 = {
      text: '本文',
      tags: ['タグ1', 'タグ2'],
    };
    const created = await fetch(`http://localhost:3000/api/entries/create`, {
      method: 'POST',
      body: JSON.stringify(entry1),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    })
    .then(response => response.json());
    assert.equal(created.text, entry1.text);
    await console.log(created);

    // Update
    const entry2 = {
      text: '更新された本文',
      tags: ['更新されたタグ1', '更新されたタグ2'],
      starred: true,
      uuid: created.uuid,
     };
    const updated = await fetch(`http://localhost:3000/api/entries/${created.uuid}`, {
      method: 'PUT',
      body: JSON.stringify(entry2),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json());
    assert.equal(entry2.uuid, updated.uuid);

//    // Read
//    const readed = await fetch(`http://localhost:3000/api/entries/${updated.uuid}`, {
//      method: 'GET',
//      headers: {
//        'Content-type': 'application/json; charset=UTF-8',
//      },
//    })
//    .then(response => response.json());
//    assert.equal(readed.text, entry2.text);

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

// 8cb4f18cccdf4422b54010fd96711ee4