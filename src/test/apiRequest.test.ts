import assert from 'assert';
import * as E from 'fp-ts/lib/Either';
import * as apiRequest from '../apiRequest';
import { getIdToken, uid } from '../firebaseAdmin';
import { Entry } from '../entryEntity';

describe('apiRequest', () => {
  it('validate', async () => {
    const idToken = await getIdToken(uid);
    const req = {
      headers: {
        authorization: `Bearer: ${idToken}`,
      },
    };
    // @ts-ignore
    const result = await apiRequest.validateToken(req);
  });
  it('keywordQuery', async () => {
    const req = {
      query: {
        q: '検索語句',
      },
    };
    // @ts-ignore
    const result = await apiRequest.keywordQuery(req);
    assert.ok(E.isRight(result));
  });
  it('starred', () => {
    assert.deepStrictEqual(
      // @ts-ignore
      apiRequest.entitize({
        body: {
          text: '本文',
          tags: ['タグ1', 'タグ2'],
          uuid: '0fd96711ee98cb4f18cccdf4422b5401',
        },
      }),
      new Entry({
        text: '本文',
        tags: ['タグ1', 'タグ2'],
        uuid: '0fd96711ee98cb4f18cccdf4422b5401',
        starred: false,
        created_at: undefined,
        modified_at: undefined,
      })
    );
  });
});
