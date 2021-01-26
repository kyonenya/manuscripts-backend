import Router from 'express-promise-router';
import path from 'path';
import * as apiController from './apiController';
import * as testController from './testController';

const router = Router();

router.get('/api/entries', apiController.showAllEntries);
router.post('/api/entries/create', apiController.createNewEntry);
router.get('/test/entries/create', testController.testCreate);
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..','public', 'index.html')));

export default router;
