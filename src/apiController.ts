import { Request, Response } from 'express';
import * as AP from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { getClient } from './postgres';
import { Boom } from '@hapi/boom';
import * as entryUseCase from './entryUseCase';
import * as apiRequest from './apiRequest';
import { Entry } from './entryEntity';

export const readAllEntries = (
  req: Request
): TE.TaskEither<Boom, Entry[]> => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.chainEitherK(apiRequest.limitQuery),
    TE.chain(entryUseCase.readAll(getClient))
  );
};

export const readOneEntry = (req: Request, res: Response) => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.chainEitherK(apiRequest.uuidParam),
    TE.chain(entryUseCase.readOne(getClient)),
    TE.map((result) => res.json(result))
  );
};

export const searchKeyword = (req: Request) => {
  return pipe(
    TE.right(req),
    TE.chain(apiRequest.validateToken),
    TE.chainEitherK((req) => AP.sequenceS(E.either)({
      keyword: apiRequest.keywordQuery(req),
      limit: apiRequest.limitQuery(req),
    })),
    // TODO
  );
};

export const createNewEntry = (
  req: Request,
  res: Response
): TE.TaskEither<Boom, Response> => {
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
    TE.chainEitherK(apiRequest.uuidParam),
    TE.chain(entryUseCase.deleteOne(getClient)),
    TE.map((result) => res.json(result))
  );
};
