import express from 'express';
import helmet from 'helmet';
import { router } from './router';

const port = process.env.PORT || 3000;

const app = express()
//  .use(helmet())
  /**
   * allow cors
   * @url https://s8a.jp/node-js-express-http-options
   */
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    next();
  })
  .options('*', (req, res) => {
    res.sendStatus(200);
  })
  // analyze request body
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use('/', router)
  .listen(port, () => console.log(`listening... port: ${port}`))
  ;
