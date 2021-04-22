import { Request } from 'express';
import Boom from '@hapi/boom';
import * as AP from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Entry } from './entryEntity';
import { authApp, uid } from './firebaseAdmin';

export const entitize = (req: Request) =>
  new Entry({
    text: req.body.text,
    tags: req.body.tags,
    uuid: req.body.uuid,
    starred: req.body.starred,
  });

export const validateToken = (
  req: Request
): TE.TaskEither<any, any> => async () => {
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
  if (!req.query.limit)
    throw Boom.badRequest('取得したい記事の件数を指定してください');
  return parseInt(req.query.limit.toString());
};

const limitQuery2 = (req: Request): E.Either<Boom.Boom<400>, number> => {
  if (!req.query.limit) {
    return E.left(Boom.badRequest('取得したい記事の件数を指定してください'));
  }
  return E.right(parseInt(req.query.limit.toString()));
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw Boom.badRequest('記事のuuidを指定してください');
  return req.params.uuid.toString();
};

const uuidParam2 = (req: Request): E.Either<Boom.Boom<400>, string> => {
  if (!req.params.uuid) {
    return E.left(Boom.badRequest('記事のuuidを指定してください'));
  }
  return E.right(req.params.uuid.toString());
};

const tagParam = (req: Request): E.Either<Boom.Boom<400>, string> => {
  if (!req.params.tag) {
    return E.left(Boom.badRequest('記事のタグを指定してください'));
  }
  return E.right(req.params.tag.toString());
};

export const readByTagRequest = (req: Request): E.Either<Boom.Boom<400>, {
  tag: string;
  limit: number;
}> => {
  return pipe(
    AP.sequenceT(E.either)(tagParam(req), limitQuery2(req)),
    E.map(([tag, limit]) => ({ tag, limit })),
  );
};
