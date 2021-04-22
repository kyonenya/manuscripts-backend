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

export const limitQuery = (req: Request): number => {
  if (!req.query.limit)
    throw badRequest('取得したい記事の件数を指定してください');
  return parseInt(req.query.limit.toString());
};

const limitQuery2 = (req: Request): E.Either<Boom<400>, number> => {
  if (!req.query.limit) return E.right(defaultLimit);
  const limit = Number.parseInt(req.query.limit.toString(), 10);
  return Number.isNaN(limit)
    ? E.left(badRequest('記事の件数には整数を指定してください'))
    : E.right(limit);
};

const keywordQuery = (req: Request): E.Either<Boom<400>, string> => {
  if (!req.query.keyword) {
    return E.left(badRequest('検索語句を指定してください'));
  }
  return E.right(req.query.keyword.toString());
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw badRequest('記事のuuidを指定してください');
  return req.params.uuid.toString();
};

export const uuidParam2 = (req: Request): E.Either<Boom<any>, string> => {
  if (!req.params.uuid) {
    return E.left(badRequest('記事のuuidを指定してください'));
  }
  return E.right(req.params.uuid.toString());
};

const tagParam = (req: Request): E.Either<Boom<400>, string> => {
  if (!req.params.tag) {
    return E.left(badRequest('記事のタグを指定してください'));
  }
  return E.right(req.params.tag.toString());
};

export const readByTagRequest = (
  req: Request
): E.Either<
  Boom<400>,
  {
    tag: string;
    limit: number;
  }
> => {
  return AP.sequenceS(E.either)({
    tag: tagParam(req),
    limit: limitQuery2(req),
  });
};

export const searchKeywordRequest = (
  req: Request
): E.Either<
  Boom<400>,
  {
    keyword: string;
    limit: number;
  }
> => {
  return AP.sequenceS(E.either)({
    keyword: keywordQuery(req),
    limit: limitQuery2(req),
  });
};
