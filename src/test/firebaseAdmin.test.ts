import assert from 'assert';
import admin, { uid, getIdToken } from '../firebaseAdmin';

describe('firebaseAdmin', () => {
  it('validate', async () => {
    const idToken = await getIdToken(uid);
    const decoded = await admin.auth().verifyIdToken(idToken);
    assert.strictEqual(decoded.uid, uid);
  });
});
