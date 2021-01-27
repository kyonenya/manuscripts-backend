import { Request, Response, RequestHandler } from 'express';
import * as entriesRepository from './entriesRepository';
import { executor } from './postgres';
import { Entry } from './entryEntity';

const entitize = (reqBody: any) => new Entry({
  text: reqBody.text,
  tags: reqBody.tags,
});

const validateRequestParams = (req: Request): { uuid: string } => {
  if (!req.query.uuid) throw new Error('uuidが指定されていません');
  return { uuid: req.query.uuid.toString() };
};

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

export const readOneEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectOne(executor);

  const params = { uuid: req.params.uuid };
  const data = await dbInvoker(params);
  res.json(data);
};

export const createNewEntry = async (req: Request, res: Response) => {
  const dbInvoker = entriesRepository.insertOne(executor);

  const entry = entitize(req.body);
  await dbInvoker(entry);
  res.json('Entry is successfly created');
}

export const updateEntry: RequestHandler = async (req, res) => {
  const args = validateRequestParams(req);
  const entry = entitize(req.body);
  res.json('Entry is successfly updated');
};

export const deleteEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.deleteOne(executor);

  const args = validateRequestParams(req);
  console.log(args);
  await dbInvoker(args);
  res.json('Entry is successfly deleted');
};
