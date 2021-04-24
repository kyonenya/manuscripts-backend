import { Request } from 'express';
import { Boom, badRequest, unauthorized } from '@hapi/boom';
import * as AP from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Entry } from './entryEntity';
import { authApp, uid } from './firebaseAdmin';

const defaultLimit = 20;

export const entitize = (req: Request): Entry =>
  new Entry({
    text: req.body.text,
    tags: req.body.tags,
    uuid: req.body.uuid,
    starred: req.body.starred,
  });

export const validateToken = (
  req: Request
): TE.TaskEither<Boom, Request> => async () => {
  if (!req.headers['authorization']) {
    return E.left(unauthorized('IDトークンを送信してください'));
  }
  const idToken = req.headers['authorization'].split(' ')[1];
  const decoded = await authApp.verifyIdToken(idToken);
  if (decoded.uid !== uid) {
    E.left(unauthorized('正しいユーザーのIDトークンを送信してください'));
  }
  return E.right(req);
};

export const limitQuery = (req: Request): E.Either<Boom, number> => {
  if (!req.query.limit) return E.right(defaultLimit);
  const limit = Number.parseInt(req.query.limit.toString(), 10);
  return Number.isNaN(limit)
    ? E.left(badRequest('記事の件数には整数を指定してください'))
    : E.right(limit);
};

export const keywordQuery = (req: Request): E.Either<Boom, string> => {
  if (!req.query.q) {
    return E.left(badRequest('検索語句を指定してください'));
  }
  return E.right(req.query.q.toString());
};

export const uuidParam = (req: Request): E.Either<Boom<any>, string> => {
  if (!req.params.uuid) {
    return E.left(badRequest('記事のuuidを指定してください'));
  }
  return E.right(req.params.uuid.toString());
};

export const tagParam = (req: Request): E.Either<Boom, string> => {
  if (!req.params.tag) {
    return E.left(badRequest('記事のタグを指定してください'));
  }
  return E.right(req.params.tag.toString());
};

export const readByTagRequest = (
  req: Request
): E.Either<
  Boom,
  {
    tag: string;
    limit: number;
  }
> => {
  return AP.sequenceS(E.either)({
    tag: tagParam(req),
    limit: limitQuery(req),
  });
};

export const searchKeywordRequest = (
  req: Request
): E.Either<
  Boom,
  {
    keyword: string;
    limit: number;
  }
> => {
  return AP.sequenceS(E.either)({
    keyword: keywordQuery(req),
    limit: limitQuery(req),
  });
};
