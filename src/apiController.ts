import { RequestHandler } from 'express';
import createError from 'http-errors';
import { getClient } from './postgres';
import * as entryUseCase from './entryUseCase';
import * as apiRequest from './apiRequest';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';
import { Either } from './Either';

export const readAllEntries: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectAll(await getClient());

  await apiRequest.validateToken(req);
  const params = apiRequest.limitQuery(req);
  const data = await dbInvoker(params);
  res.json(data);
};

export const readOneEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectOne(await getClient());

  await apiRequest.validateToken(req);
  const uuid = apiRequest.uuidParams(req);
  const data = await dbInvoker({ uuid });
  res.json(data);
};

export const createNewEntry: RequestHandler = async (req, res) => {
  await apiRequest.validateToken(req);
  const result = await entryUseCase.createOneEntry({
    client: await getClient(),
    entry: apiRequest.entitize(req.body),
  });
  res.json(result);
};

export const updateEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.updateOne(await getClient());

  await apiRequest.validateToken(req);
  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
};

export const deleteEntry: RequestHandler = async (req, res) => {
  const result = await entryUseCase.deleteOneEntry({
    client: await getClient(),
    uuid: apiRequest.uuidParams(req),
  });
  res.json(result);
};
