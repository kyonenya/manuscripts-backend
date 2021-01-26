import { Request, Response } from 'express';
import * as entriesRepository from './entriesRepository';
import { executor } from './postgres';

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

export const createNewEntry = (req: Request, res: Response) => {
  console.log(req.body);
  const entry = new Entry();
  res.json('Entry is successfly created');
}
