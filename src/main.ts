import express from 'express';
import helmet from 'helmet';
import { router } from './router';

const port = process.env.PORT || 3000;

const app = express()
//  .use(helmet())
  // analyze request body
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use('/', router)
  .listen(port, () => console.log(`listening... port: ${port}`))
  ;
