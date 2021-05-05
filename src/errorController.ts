import { RequestHandler, ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { Boom } from '@hapi/boom';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).send('404 | ルートが見つかりません');
};
