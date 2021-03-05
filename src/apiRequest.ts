import { Request } from 'express';
import { Entry } from './entryEntity';
import { Either } from './Either';

export const entitize = (reqBody: Request['body']) => new Entry({
  text: reqBody.text,
  tags: reqBody.tags,
  uuid: reqBody.uuid,
  starred: reqBody.starred,
});

export const limitQuery = (req: Request): Either<Error, { limit: number }> => {
  if (!req.query.limit) return Either.ofLeft(new Error('件数が指定されていません'));
  return Either.ofRight({ limit: parseInt(req.query.limit.toString())});
};

export const uuidParams = (req: Request): string => {
  if (!req.params.uuid) throw new Error('uuidが指定されていません');
  return req.params.uuid.toString();
};
