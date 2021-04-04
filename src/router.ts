import Router from 'express-promise-router';
import path from 'path';
import * as apiController from './apiController';
import * as errorController from './errorController';

export const router = Router()
  .get('/api/entries', apiController.readAllEntries)
  .get('/api/entries/:uuid', apiController.readOneEntry)
  .post('/api/entries/:uuid', (req, res) => apiController.createNewEntry(req, res)())
  .put('/api/entries/:uuid', apiController.updateEntry)
  .delete('/api/entries/:uuid', apiController.deleteEntry)
  .get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html')))
  .use(errorController.notFound)
  .use(errorController.internalError)
  ;
