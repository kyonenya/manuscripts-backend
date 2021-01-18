import Router from 'express-promise-router';
import path from 'path';
import * as apiController from './apiContoroller';

const router = Router();

router.get('/api/entries', apiController.showAllEntries);
router.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..','public', 'index.html')));

export default router;
