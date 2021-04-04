import { Request, Response } from 'express';
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function';
import { tap } from './functions';
import { getClient } from './postgres';
import * as entryUseCase from './entryUseCase';
import * as apiRequest from './apiRequest';
import { Either } from './Either';

export const readAllEntries = async (req: Request, res: Response) => {
  await apiRequest.validateToken(req);
  const limit = apiRequest.limitQuery(req);
  const data = await entryUseCase.readAll(await getClient())(limit);
  res.json(data);
};

export const readOneEntry = async (req: Request, res: Response) => {
  await apiRequest.validateToken(req);
  const uuid = apiRequest.uuidParams(req);
  const data = await entryUseCase.readOne(await getClient())(uuid);
  res.json(data);
};

export const createNewEntry = async (req: Request, res: Response) => {
  return pipe(
    TE.right(req),
    TE.map(tap(apiRequest.validateToken2)),
    TE.map(apiRequest.entitize),
    TE.chain(entryUseCase.createOne(getClient)),
    TE.map(result => res.json(result))
  );
};

export const updateEntry = async (req: Request, res: Response) => {
  await apiRequest.validateToken(req);
  const entry = apiRequest.entitize(req);
  const result = await entryUseCase.updateOne(await getClient())(entry);
  res.json(result);
};

export const deleteEntry = async (req: Request, res: Response) => {
  const uuid = apiRequest.uuidParams(req);
  const result = await entryUseCase.deleteOne(await getClient())(uuid);
  res.json(result);
};
