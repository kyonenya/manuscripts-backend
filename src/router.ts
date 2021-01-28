import Router from 'express-promise-router';
import path from 'path';
import * as apiController from './apiController';
import * as testController from './testController';

const router = Router();

router.get('/api/entries', apiController.showAllEntries);
router.get('/api/entries/:uuid', apiController.readOneEntry);
router.post('/api/entries/create', apiController.createNewEntry);
router.put('/api/entries/:uuid', apiController.updateEntry);
router.delete('/api/entries/:uuid', apiController.deleteEntry);
router.get('/test/entries/create', testController.testCreate);
router.get('/test/entries/update/:uuid', testController.testUpdate);
router.get('/test/entries/delete/:uuid', testController.testDelete);
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..','public', 'index.html')));

export default router;

// 356636c5cb134559a4ebc2884207d709