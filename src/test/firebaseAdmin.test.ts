import assert from 'assert';
import { authApp, uid, getIdToken } from '../firebaseAdmin';

describe('firebaseAdmin', () => {
  it('validate', async () => {
    const idToken = await getIdToken(uid);
    const decoded = await authApp.verifyIdToken(idToken);
    assert.strictEqual(decoded.uid, uid);
  });
});
