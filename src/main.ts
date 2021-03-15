import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { router } from './router';
import { allowCors } from './allowCors';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express()
  .use(allowCors)
  .options('*', (req, res) => res.sendStatus(200)) // preflight
  .use(express.urlencoded({ extended: false })) // analyze request body
  .use(express.json())
  .use('/', router)
  .listen(port, () => console.log(`listening... port: ${port}`));
