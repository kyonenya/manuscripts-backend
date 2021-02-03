import { Request } from 'express';
import { Entry } from './entryEntity';

export const entitize = (reqBody: Request['body']) => new Entry({
  text: reqBody.text,
  tags: reqBody.tags,
  uuid: reqBody.uuid,
  starred: reqBody.starred,
});

export const limitQuery = (req: Request) => {
  if (!req.query.limit) throw new Error('件数が指定されていません');
  return { limit: parseInt(req.query.limit.toString()) };
};

export const uuidParams = (req: Request): { uuid: string } => {
  if (!req.params.uuid) throw new Error('uuidが指定されていません');
  return { uuid: req.params.uuid.toString() };
};
