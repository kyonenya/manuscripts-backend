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

export const validateToken = (req: Request): TE.TaskEither<any, any> => async () => {
  if (!req.headers['authorization']) {
    return E.left(Boom.unauthorized('IDトークンを送信してください'));
  }
  const idToken = req.headers['authorization'].split(' ')[1];
  const decoded = await authApp.verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    E.left(Boom.unauthorized('正しいユーザーのIDトークンを送信してください'));
  }
  return E.right(req);
};

export const limitQuery = (req: Request): number => {
  if (!req.query.limit) throw Boom.badRequest('取得したい記事の件数を指定してください');
  return parseInt(req.query.limit.toString());
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw Boom.badRequest('記事のuuidを指定してください');
  return req.params.uuid.toString();
};
