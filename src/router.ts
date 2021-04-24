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
  .get('/api/entries/:uuid', (req, res) =>
    apiController.readOneEntry(req, res)()
  )
  .get('/api/entries/search', wrapper(apiController.searchKeyword))
  .post('/api/entries/:uuid', (req, res) =>
    apiController.createNewEntry(req, res)()
  )
  .put('/api/entries/:uuid', (req, res) =>
    apiController.updateEntry(req, res)()
  )
  .delete('/api/entries/:uuid', (req, res) =>
    apiController.deleteEntry(req, res)()
  )
  .get('/', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'))
  )
  .use(errorController.notFound);
