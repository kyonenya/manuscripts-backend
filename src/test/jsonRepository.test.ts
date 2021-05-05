import assert from 'assert';
import path from 'path';
import * as jsonRepository from '../jsonRepository';

describe('jsonRepository', () => {
  it('unescape', () => {
    assert.strictEqual(jsonRepository.unescape('J\\. デリダ'), 'J. デリダ');
    assert.strictEqual(
      jsonRepository.unescape('一行目\\n二行目'),
      '一行目\n二行目'
    );
    assert.strictEqual(
      jsonRepository.unescape('一行目\n二行目'),
      '一行目\n二行目'
    );
    assert.strictEqual(jsonRepository.unescape('​*構成*​'), '*構成*');
    assert.strictEqual(
      jsonRepository.unescape('https://sample\\.co\\.jp'),
      'https://sample.co.jp'
    );
  });
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
