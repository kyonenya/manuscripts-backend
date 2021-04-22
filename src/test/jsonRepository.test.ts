import assert from 'assert';
import path from 'path';
import * as jsonRepository from '../jsonRepository';

describe('jsonRepository', () => {
  it('readAll', async () => {
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      'assets',
      'dayone-210320.json'
    );
    const entries = await jsonRepository.readAll(filePath);
  });
});
