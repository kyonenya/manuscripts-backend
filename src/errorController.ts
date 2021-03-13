import { RequestHandler, ErrorRequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) => {
  res.status(404);
  res.send('404 | ルートが見つかりません');
};

export const internalError: ErrorRequestHandler = (err, req, res, next) =>{
  console.error(err.stack);
  res.status(500);
  res.send(`500 | Sorry, our application is experiencing a problem.`);
};
