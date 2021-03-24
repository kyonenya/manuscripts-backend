import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task';  
import { Request } from 'express';
import Boom from '@hapi/boom';
import { Entry } from './entryEntity';
import { authApp, uid } from './firebaseAdmin';

export const entitize = (req: Request) =>
  new Entry({
    text: req.body.text,
    tags: req.body.tags,
    uuid: req.body.uuid,
    starred: req.body.starred,
  });

export const validateToken = async (req: Request) => {
  if (!req.headers['authorization']) {
    throw Boom.unauthorized('認証エラー: idトークンが空です');
  }
  const idToken = req.headers['authorization'].split(' ')[1];
  const decoded = await authApp.verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    throw Boom.unauthorized('認証エラー: 異なるuidです');
  }
  return req;
};

export const validateToken2 = (req: Request): TE.TaskEither<any, any> => async () => {
  if (!req.headers['authorization']) {
    return E.left(Boom.unauthorized('認証エラー: idトークンが空です'));
  }
  const idToken = req.headers['authorization'].split(' ')[1];
  const decoded = await authApp.verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    E.left(Boom.unauthorized('認証エラー: 異なるuidです'));
  }
  return E.right(req);
};

export const limitQuery = (req: Request) => {
  if (!req.query.limit) throw new Error('件数が指定されていません');
  return { limit: parseInt(req.query.limit.toString()) };
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw new Error('uuidが指定されていません');
  return req.params.uuid.toString();
};
