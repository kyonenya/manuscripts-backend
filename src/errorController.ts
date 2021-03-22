import { RequestHandler, ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';

export const notFound: RequestHandler = (req, res) => {
  res.status(404);
  res.send('404 | ルートが見つかりません');
};

export const internalError: ErrorRequestHandler = (err, req, res, next) =>{
  console.error(err);
  return res.status(err.statusCode).json({
    error: {
      statusCode: err.statusCode,
      name: err.name,
      message: err.message,
    },
  });
};
