import Router from 'express-promise-router';
import path from 'path';
import * as apiController from './apiController';

export const router = Router()
  .get('/api/entries', apiController.readAllEntries)
  .get('/api/entries/:uuid', apiController.readOneEntry)
  .post('/api/entries/:uuid', apiController.createNewEntry)
  .put('/api/entries/:uuid', apiController.updateEntry)
  .delete('/api/entries/:uuid', apiController.deleteEntry)
  .get('/', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'))
  );
