import Router from 'express-promise-router';
import { Request, Response, RequestHandler } from 'express';
import path from 'path';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { Boom } from '@hapi/boom';
import * as apiResponse from './apiResponse';
import * as apiController from './apiController';
import * as errorController from './errorController';

const wrapper = (
  controller: (req: Request) => TE.TaskEither<Boom | Error, unknown>
): RequestHandler => (req: Request, res: Response) => {
  pipe(
    controller(req),
    TE.map(apiResponse.json(res)),
    TE.mapLeft(apiResponse.error(res))
  )();
};

export const router = Router()
  .get('/api/entries', wrapper(apiController.readAllEntries))
  .get('/api/entries/:uuid', wrapper(apiController.readOneEntry))
  .get('/api/entries/search', wrapper(apiController.searchKeyword))
  .post('/api/entries/:uuid', wrapper(apiController.createNewEntry))
  .put('/api/entries/:uuid', wrapper(apiController.updateEntry))
  .delete('/api/entries/:uuid', wrapper(apiController.deleteEntry))
  .use(errorController.notFound);
