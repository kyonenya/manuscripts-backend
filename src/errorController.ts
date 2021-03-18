import { RequestHandler, ErrorRequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) => {
  res.sendStatus(404);
  res.send('404 | ルートが見つかりません');
};

export const internalError: ErrorRequestHandler = (err, req, res) =>{
  console.error(err.stack);
  res.sendStatus(500);
  res.send(err.toString());
};
