import assert from 'assert';
import path from 'path';
import { getClient } from '../postgres';
import * as jsonUseCase from '../jsonUseCase';
import { Entry } from '../entryEntity';
import * as TE from 'fp-ts/lib/TaskEither'

describe('jsonUseCase', () => {
  it('importAll', async () => {
    const filePath = path.resolve(__dirname, '..', '..', 'assets', 'dayone-210320.json');
    const result = await jsonUseCase.importAll(getClient)(filePath)();
    console.log(result);
  });
});
