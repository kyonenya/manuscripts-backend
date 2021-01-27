import { Request, Response } from 'express';
import * as entriesRepository from './entriesRepository';
import { executor } from './postgres';
import { Entry } from './entryEntity';

export const showAllEntries = async (req: Request, res: Response) => {
  const validateRequest = (req: Request) => {
    if (!req.query.limit) throw new Error('件数が指定されていません');
    // TODO: parsedQsの型を調べる
    return { limit: parseInt(req.query.limit.toString()) };
  };
  const dbInvoker = entriesRepository.selectAll(executor);

  const params = validateRequest(req);
  const data = await dbInvoker(params);
  res.json(data);
};

export const createNewEntry = async (req: Request, res: Response) => {
  const entitize = (reqBody: any) => new Entry({
    text: reqBody.text,
    tags: reqBody.tags,
  })
  const dbInvoker = entriesRepository.insertOne(executor);
  
  const entry = entitize(req.body);
  await dbInvoker(entry);
  res.json('Entry is successfly created');
}
