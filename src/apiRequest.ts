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
    throw Boom.unauthorized('idトークンが空です');
  }
  const idToken = req.headers['authorization'].split(' ')[1];
  const decoded = await authApp.verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    throw Boom.unauthorized('異なるuidです');
  }
  return req;
};

export const validateToken2 = (req: Request): TE.TaskEither<any, any> => async () => {
  if (!req.headers['authorization']) {
    return E.left(Boom.unauthorized('idトークンが空です'));
  }
  const idToken = req.headers['authorization'].split(' ')[1];
  const decoded = await authApp.verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    E.left(Boom.unauthorized('異なるuidです'));
  }
  return E.right(req);
};

export const limitQuery = (req: Request): number => {
  if (!req.query.limit) throw Boom.badRequest('件数が指定されていません');
  return parseInt(req.query.limit.toString());
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw Boom.badRequest('uuidが指定されていません');
  return req.params.uuid.toString();
};
