import { Request, Response, RequestHandler } from 'express';
import { executor } from './postgres';
import * as apiRequest from './apiRequest';
import * as entriesRepository from './entriesRepository';
import { Entry } from './entryEntity';

export const showAllEntries = async (req: Request, res: Response) => {
  const dbInvoker = entriesRepository.selectAll(executor);

  const params = apiRequest.limitQuery(req);
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

  const entry = apiRequest.entitize(req.body);
  await dbInvoker(entry);
  res.json('Entry is successfly created');
}

export const updateEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.updateOne(executor);

  const args = apiRequest.uuidParams(req);
  const entry = apiRequest.entitize(req.body);
  res.json('Entry is successfly updated');
};

export const deleteEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.deleteOne(executor);

  const args = apiRequest.uuidParams(req);
  await dbInvoker(args);
  res.json('Entry is successfly deleted');
};
