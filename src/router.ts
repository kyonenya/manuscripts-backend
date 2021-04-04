import Router from 'express-promise-router';
import { Request, Response } from 'express';
import path from 'path';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither'
import * as apiController from './apiController';
import * as errorController from './errorController';

const wrapper = (controller: (req: Request, res: Response) => TE.TaskEither<unknown, unknown>) => (req: Request, res: Response) => {
  pipe(
    controller(req, res),
    TE.map(result => res.json(result)),
  )();
};

export const router = Router()
  .get('/api/entries', wrapper(apiController.readAllEntries))
  .get('/api/entries/:uuid', (req, res) => apiController.readOneEntry(req, res)())
  .post('/api/entries/:uuid', (req, res) => apiController.createNewEntry(req, res)())
  .put('/api/entries/:uuid', (req, res) => apiController.updateEntry(req, res)())
  .delete('/api/entries/:uuid', (req, res) => apiController.deleteEntry(req, res)())
  .get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html')))
  .use(errorController.notFound)
  .use(errorController.internalError)
  ;
