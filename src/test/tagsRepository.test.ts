import assert from 'assert';
import { pool } from '../postgres';
import * as tagsRepository from '../tagsRepository';
import { v4 as uuidv4 } from 'uuid';

describe('tagsRepository', () => {
  const uuid = uuidv4().replace(/-/g, '');
  const tags = ['タグA', 'タグB'];
  console.log(`testing... uuid:${uuid}`);

  it('insertAll', async () => {
    const dbInvoker = tagsRepository.insertAll(await pool.connect());
    await dbInvoker({ uuid, tags });
  });
  it('deleteAll', async () => {
    const dbInvoker = tagsRepository.deleteAll(await pool.connect());
    await dbInvoker({ uuid });
  });
});
