import { RequestHandler, ErrorRequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) => {
  res.status(404);
  res.send('404 | ルートが見つかりません');
};

export const internalError: ErrorRequestHandler = (err, req, res, next) =>{
  if (err.statusCode >= 500) {
    return res.status(500).json({
      error: {
        name: err.name,
      },
    });
  }
  return res.status(err.statusCode).json({
    error: {
      name: err.name,
      message: err.message,
    },
  });
};
