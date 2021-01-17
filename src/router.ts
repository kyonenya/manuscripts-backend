import Router from 'express-promise-router';
import * as apiController from './apiContoroller';

const router = Router();

router.get('/', (req, res) => res.json('Hello World'));
router.get('/api/entries', apiController.showAllEntries);

export default router;
