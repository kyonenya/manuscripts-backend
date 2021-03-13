import { Request } from 'express';
import { Entry } from './entryEntity';
import /* admin, */ { uid } from './firebaseAdmin';
import admin from 'firebase-admin';

export const entitize = (reqBody: Request['body']) =>
  new Entry({
    text: reqBody.text,
    tags: reqBody.tags,
    uuid: reqBody.uuid,
    starred: reqBody.starred,
  });

export const validateToken = async (req: Request) => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'manuscripts-kyonenya',
      clientEmail:
        'firebase-adminsdk-36vwk@manuscripts-kyonenya.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
//  if (!req.headers['authorization']) {
//    throw new Error('認証エラー: idトークンが空です');
//  }
//  const idToken = req.headers['authorization'].split(' ')[1];
  const idToken = '';
  const decoded = await admin.auth().verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    throw new Error('認証エラー：異なるuidです');
  }
  return req;
};

export const limitQuery = (req: Request) => {
  if (!req.query.limit) throw new Error('件数が指定されていません');
  return { limit: parseInt(req.query.limit.toString()) };
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw new Error('uuidが指定されていません');
  return req.params.uuid.toString();
};
