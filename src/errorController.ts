import { RequestHandler, ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { Boom } from '@hapi/boom';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).send('404 | ルートが見つかりません');
};

//export const internalError: ErrorRequestHandler = (err, req, res, next) =>{
//  console.error(err);
//  if (err instanceof Boom) {
//    return res.status(err.output.statusCode).json({
//      error: err.output.payload
//    });
//  }
//  return res.status(err.statusCode).json({
//    error: {
//      statusCode: err.statusCode,
//      name: err.name,
//      message: err.message,
//    },
//  });
//};
