import { RequestHandler } from 'express';
import { pool, executor } from './postgres';
import * as apiRequest from './apiRequest';
import * as entriesRepository from './entriesRepository';
import { Entry } from './entryEntity';
import { Either } from './Either';

export const readAllEntries: RequestHandler = async (req, res) => {
  Either.ofRight(apiRequest.limitQuery(req))
    .map(entriesRepository.selectAll(await pool.connect()))
    .awaitMap(data => res.json(data))
    ;
};

export const readOneEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectOne(executor);

  const params = apiRequest.uuidParams(req);
  const data = await dbInvoker(params);
  res.json(data);
};

export const createNewEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.insertOne(executor);

  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
}

export const updateEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.updateOne(executor);

  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
};

export const deleteEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.deleteOne(executor);

  const args = apiRequest.uuidParams(req);
  const result = await dbInvoker(args);
  res.json(result);
};
