import { Request, Response } from 'express';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { getClient } from './postgres';
import * as Boom from '@hapi/boom';
import * as entryUseCase from './entryUseCase';
import * as apiRequest from './apiRequest';
import { Entry } from './entryEntity';

export const readAllEntries = (
  req: Request
): TE.TaskEither<Boom.Boom<500>, Entry[]> => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.map(apiRequest.limitQuery),
    TE.chain(entryUseCase.readAll(getClient))
  );
};

export const readOneEntry = (req: Request, res: Response) => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.map(apiRequest.uuidParams),
    TE.chain(entryUseCase.readOne(getClient)),
    TE.map((result) => res.json(result))
  );
};

export const createNewEntry = (
  req: Request,
  res: Response
): TE.TaskEither<Boom.Boom, Response> => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.map(apiRequest.entitize),
    TE.chain(entryUseCase.createOne(getClient)),
    TE.map((result) => res.json(result))
  );
};

export const updateEntry = (req: Request, res: Response) => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.map(apiRequest.entitize),
    TE.chain(entryUseCase.updateOne(getClient)),
    TE.map((result) => res.json(result))
  );
};

export const deleteEntry = (req: Request, res: Response) => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.map(apiRequest.uuidParams),
    TE.chain(entryUseCase.deleteOne(getClient)),
    TE.map((result) => res.json(result))
  );
};
