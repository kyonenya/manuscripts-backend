import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router } from './router';

dotenv.config();
const port = process.env.PORT || 3000;

express()
  .use(cors())
  .options('*', (req, res) => res.sendStatus(200)) // preflight
  .use(express.urlencoded({ extended: false })) // analyze request body
  .use(express.json())
  .use('/', router)
  .listen(port, () => console.log(`listening... port: ${port}`));
