import { Request } from 'express';
import * as E from 'fp-ts/lib/Either';
import { Entry } from './entryEntity';

export const entitize = (reqBody: Request['body']) => new Entry({
  text: reqBody.text,
  tags: reqBody.tags,
  uuid: reqBody.uuid,
  starred: reqBody.starred,
});

export const limitQuery = (req: Request) => {
  if (!req.query.limit) return E.left(new Error('件数が指定されていません'));
  return E.right({ limit: parseInt(req.query.limit.toString())});
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw new Error('uuidが指定されていません');
  return req.params.uuid.toString();
};
